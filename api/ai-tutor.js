// ============================================================================
// Vercel / Node.js Serverless Function: /api/ai-tutor
// Secure Backend Proxy for AI NETWORK TUTOR (Gemini API)
// - Supports Real-Time Server-Sent Events (SSE) Streaming (`stream: true`)
//   via Gemini `:streamGenerateContent?alt=sse` for TTFB < 800ms
// - Preserves standard JSON `generateContent` fallback
// - Protects secret GEMINI_API_KEY in server environment variables
// - Enforces payload size limits (<= 4MB), rate protection with TTL eviction,
//   model allowlist, timeout, retry logic, usageMetadata & follow-up suggestions
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024; // 4 MB limit
const MAX_CONVERSATION_TURNS = 30;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const MAX_TRACKED_IPS = 2000;

const ALLOWED_MODELS = new Set([
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
]);

const ipRequestCounts = new Map();
let lastCleanupAt = Date.now();

function cleanupIpRateLimitStore(now) {
  if (now - lastCleanupAt < RATE_LIMIT_CLEANUP_INTERVAL_MS && ipRequestCounts.size < MAX_TRACKED_IPS) {
    return;
  }
  for (const [ip, entry] of ipRequestCounts.entries()) {
    if (!entry || now > entry.resetAt) {
      ipRequestCounts.delete(ip);
    }
  }
  // Hard cap protection against memory exhaustion under distributed bursts
  if (ipRequestCounts.size > MAX_TRACKED_IPS) {
    const excess = ipRequestCounts.size - MAX_TRACKED_IPS;
    let removed = 0;
    for (const ip of ipRequestCounts.keys()) {
      ipRequestCounts.delete(ip);
      removed += 1;
      if (removed >= excess) break;
    }
  }
  lastCleanupAt = now;
}

function checkRateLimit(clientIp) {
  const now = Date.now();
  cleanupIpRateLimitStore(now);
  const entry = ipRequestCounts.get(clientIp) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  ipRequestCounts.set(clientIp, entry);
  return entry.count <= MAX_REQUESTS_PER_MINUTE;
}

function buildFollowUpSuggestions(userText = "", responseText = "") {
  const combined = `${userText} ${responseText}`.toLowerCase();
  if (combined.includes("vlan") || combined.includes("trunk") || combined.includes("802.1q")) {
    return [
      "Cho tôi lệnh show kiểm tra Native VLAN và Allowed VLAN trên Trunk",
      "Tại sao cần Router-on-a-Stick hoặc SVI để định tuyến Inter-VLAN?",
      "Tạo 2 câu hỏi trắc nghiệm bẫy đề thi CCNA về VLAN & Trunking"
    ];
  }
  if (combined.includes("ospf") || combined.includes("router-id") || combined.includes("dr/bdr")) {
    return [
      "Giải thích 7 trạng thái OSPF Neighbor (Down → Full) và lỗi hay kẹt ở EXSTART",
      "Cách tính OSPF Cost khi Reference Bandwidth thay đổi",
      "So sánh nhanh OSPF vs EIGRP vs Static Route trong đề thi CCNA"
    ];
  }
  if (combined.includes("subnet") || combined.includes("vlsm") || combined.includes("cidr") || combined.includes("wildcard")) {
    return [
      "Hướng dẫn tính nhanh Wildcard Mask cho OSPF và Extended ACL",
      "Cho ví dụ bài toán chia VLSM 3 phòng ban và giải từng bước",
      "Cách nhận diện nhanh 2 IP có cùng Subnet hay không trong 10 giây"
    ];
  }
  if (combined.includes("nat") || combined.includes("pat") || combined.includes("acl")) {
    return [
      "Phân biệt Inside Local, Inside Global, Outside Local, Outside Global",
      "Quy tắc đặt Standard ACL (gần đích) và Extended ACL (gần nguồn)",
      "Các lệnh show & debug để kiểm tra NAT/PAT đang hoạt động"
    ];
  }
  if (combined.includes("stp") || combined.includes("bpdu") || combined.includes("etherchannel") || combined.includes("lacp")) {
    return [
      "Trình tự bầu chọn Root Bridge và Root Port trong STP/RSTP",
      "So sánh LACP (Active/Passive) và PAgP (Desirable/Auto)",
      "Khi nào dùng PortFast, BPDU Guard và Root Guard trên Switch doanh nghiệp?"
    ];
  }
  return [
    "Cho tôi bảng lệnh Cisco IOS show/verify quan trọng nhất của phần này",
    "Tóm tắt 3 bẫy đề thi CCNA 200-301 hay gặp nhất về chủ đề này",
    "Tạo 2 câu hỏi trắc nghiệm thực chiến kèm giải thích chi tiết"
  ];
}

async function fetchWithRetry(url, options, maxRetries = 2, timeoutMs = 25000) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (response.status === 503 || response.status === 502 || response.status === 504) {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          continue;
        }
      }
      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("Request timed out");
}

module.exports = async (req, res) => {
  const origin = req.headers?.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  const contentLength = Number(req.headers?.["content-length"] || 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return res.status(413).json({
      error: "Payload Too Large. Kích thước yêu cầu vượt quá giới hạn an toàn (4MB)."
    });
  }

  const clientIp = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Rate limit exceeded (Tối đa 30 yêu cầu/phút). Vui lòng đợi ít giây rồi thử lại."
    });
  }

  try {
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    if (rawBody.length > MAX_PAYLOAD_BYTES) {
      return res.status(413).json({ error: "Payload Too Large (Max 4MB)." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const apiKey = (process.env.GEMINI_API_KEY || body.clientApiKey || "").trim();
    const rawModel = (body.model || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite").replace(/[^a-zA-Z0-9._-]/g, "");
    const model = ALLOWED_MODELS.has(rawModel) ? rawModel : "gemini-2.5-flash-lite";
    const wantStream = body.stream === true;

    if (!apiKey) {
      return res.status(401).json({
        error: "Server chưa cấu hình biến môi trường GEMINI_API_KEY.",
        code: "MISSING_API_KEY"
      });
    }

    if (!Array.isArray(body.contents) || body.contents.length === 0) {
      return res.status(400).json({
        error: "Bad Request: 'contents' phải là một mảng tin nhắn hợp lệ."
      });
    }

    const sanitizedContents = body.contents.slice(-MAX_CONVERSATION_TURNS);
    const lastUserTurn = sanitizedContents[sanitizedContents.length - 1];
    const lastUserText = lastUserTurn?.parts?.map((p) => p.text || "").join(" ") || "";

    const geminiPayload = {
      systemInstruction: body.systemInstruction,
      contents: sanitizedContents,
      generationConfig: {
        temperature: typeof body.generationConfig?.temperature === "number"
          ? Math.min(1.0, Math.max(0.0, body.generationConfig.temperature))
          : 0.25,
        maxOutputTokens: typeof body.generationConfig?.maxOutputTokens === "number"
          ? Math.min(4096, Math.max(128, body.generationConfig.maxOutputTokens))
          : 1536
      }
    };

    // =========================================================================
    // MODE A: Server-Sent Events (SSE) Real-Time Streaming
    // =========================================================================
    if (wantStream) {
      const streamEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
      const upstreamRes = await fetchWithRetry(streamEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      }, 1, 30000);

      if (!upstreamRes.ok || !upstreamRes.body) {
        const errData = await upstreamRes.json().catch(() => ({}));
        return res.status(upstreamRes.status || 502).json({
          error: errData?.error?.message || `Gemini Stream HTTP ${upstreamRes.status}`,
          status: upstreamRes.status
        });
      }

      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      const reader = upstreamRes.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullText = "";
      let finalUsage = null;
      let modelVersion = model;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
              if (parsed?.usageMetadata) finalUsage = parsed.usageMetadata;
              if (parsed?.modelVersion) modelVersion = parsed.modelVersion;
              if (delta) {
                fullText += delta;
                res.write(`data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`);
              }
            } catch {
              // Ignore partial non-JSON SSE lines
            }
          }
        }
      } finally {
        const followUpSuggestions = buildFollowUpSuggestions(lastUserText, fullText);
        res.write(`data: ${JSON.stringify({
          type: "done",
          usageMetadata: finalUsage,
          modelVersion,
          followUpSuggestions
        })}\n\n`);
        res.end();
      }
      return;
    }

    // =========================================================================
    // MODE B: Standard JSON Fallback (generateContent)
    // =========================================================================
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || `Gemini API HTTP ${response.status}`,
        status: response.status
      });
    }

    const fullText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";
    return res.status(200).json({
      candidates: data.candidates,
      usageMetadata: data.usageMetadata || null,
      modelVersion: data.modelVersion || model,
      followUpSuggestions: buildFollowUpSuggestions(lastUserText, fullText)
    });
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({
        error: err.name === "AbortError" ? "Yêu cầu quá thời gian chờ (Timeout 25s)." : (err.message || "Internal Server Error")
      });
    }
    res.write(`data: ${JSON.stringify({ type: "error", error: err.message || "Stream interrupted" })}\n\n`);
    res.end();
  }
};
