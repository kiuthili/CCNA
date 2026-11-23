// ============================================================================
// Vercel / Node.js Serverless Function: /api/ai-tutor
// Secure Backend Proxy for AI NETWORK TUTOR (Gemini API)
// - Protects secret GEMINI_API_KEY in server environment variables
// - Enforces payload size limits (<= 4MB), rate protection, model allowlist,
//   timeout, and retry logic
// - Never logs API keys or sensitive user tokens
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024; // 4 MB limit
const MAX_CONVERSATION_TURNS = 30;
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

function checkRateLimit(clientIp) {
  const now = Date.now();
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

  const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
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
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

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

    return res.status(200).json({
      candidates: data.candidates,
      usageMetadata: data.usageMetadata || null,
      modelVersion: data.modelVersion || model
    });
  } catch (err) {
    return res.status(500).json({
      error: err.name === "AbortError" ? "Yêu cầu quá thời gian chờ (Timeout 25s)." : (err.message || "Internal Server Error")
    });
  }
};
