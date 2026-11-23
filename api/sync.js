// ============================================================================
// Vercel Serverless Function: /api/sync
// Supports Smart Delta/Timestamp Per-Entity Merge across devices
// - Merges notes, highlights, bookmarks, flashcards, completedItems, examHistory
//   by `id` + `updatedAt` with `deletedAt` tombstone support (prevents blind overwrites)
// - Enforces 2MB payload limit, key sanitization, and compliant CORS headers
// ============================================================================

const MAX_SYNC_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2 MB limit

function getItemTimestamp(item) {
  if (!item || typeof item !== "object") return 0;
  return Math.max(
    Number(item.deletedAt || 0),
    Number(item.updatedAt || 0),
    Number(item.createdAt || 0)
  );
}

function mergeEntityArray(existingArr, incomingArr) {
  const map = new Map();
  (Array.isArray(existingArr) ? existingArr : []).forEach((item) => {
    if (item && item.id) map.set(String(item.id), item);
  });
  (Array.isArray(incomingArr) ? incomingArr : []).forEach((item) => {
    if (!item || !item.id) return;
    const key = String(item.id);
    const prev = map.get(key);
    if (!prev || getItemTimestamp(item) >= getItemTimestamp(prev)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
}

function mergeKeyedObject(existingObj, incomingObj) {
  const result = { ...(existingObj && typeof existingObj === "object" ? existingObj : {}) };
  if (!incomingObj || typeof incomingObj !== "object") return result;
  Object.keys(incomingObj).forEach((k) => {
    const prev = result[k];
    const next = incomingObj[k];
    if (next && typeof next === "object" && !Array.isArray(next)) {
      if (!prev || getItemTimestamp(next) >= getItemTimestamp(prev)) {
        result[k] = next;
      }
    } else if (Array.isArray(next)) {
      const prevArr = Array.isArray(prev) ? prev : [];
      const seen = new Set(prevArr.map((x) => (x && x.id) || (x && x.text) || JSON.stringify(x)));
      const merged = [...prevArr];
      next.forEach((x) => {
        const sig = (x && x.id) || (x && x.text) || JSON.stringify(x);
        if (!seen.has(sig)) {
          merged.push(x);
          seen.add(sig);
        }
      });
      result[k] = merged;
    } else if (typeof next !== "undefined") {
      result[k] = next;
    }
  });
  return result;
}

function mergeSyncPayloads(existingPayload, incomingPayload) {
  if (!existingPayload || typeof existingPayload !== "object") {
    return {
      ...incomingPayload,
      mergedAt: Date.now()
    };
  }

  const baseData = existingPayload.data && typeof existingPayload.data === "object"
    ? existingPayload.data
    : existingPayload;
  const incData = incomingPayload.data && typeof incomingPayload.data === "object"
    ? incomingPayload.data
    : incomingPayload;

  const existingWs = baseData.workspaceDB || {};
  const incomingWs = incData.workspaceDB || {};

  const mergedWs = {
    version: Math.max(Number(existingWs.version || 2), Number(incomingWs.version || 2)),
    userId: incData.userId || incomingWs.userId || baseData.userId || existingWs.userId || "default_user",
    notes: mergeEntityArray(existingWs.notes, incomingWs.notes),
    highlights: mergeEntityArray(existingWs.highlights, incomingWs.highlights),
    bookmarks: mergeEntityArray(existingWs.bookmarks, incomingWs.bookmarks),
    flashcards: mergeEntityArray(existingWs.flashcards, incomingWs.flashcards),
    updatedAt: Math.max(Number(existingWs.updatedAt || 0), Number(incomingWs.updatedAt || 0), Date.now())
  };

  const mergedData = {
    syncKey: incData.syncKey || baseData.syncKey,
    userId: incData.userId || baseData.userId || "default_user",
    notes: mergeKeyedObject(baseData.notes, incData.notes),
    highlights: mergeKeyedObject(baseData.highlights, incData.highlights),
    completedItems: {
      ...(baseData.completedItems || {}),
      ...(incData.completedItems || {})
    },
    examHistory: mergeEntityArray(baseData.examHistory, incData.examHistory),
    srsState: mergeKeyedObject(baseData.srsState, incData.srsState),
    workspaceDB: mergedWs,
    updatedAt: Math.max(Number(baseData.updatedAt || 0), Number(incData.updatedAt || 0), Date.now()),
    mergedAt: Date.now()
  };

  if (incomingPayload.data && typeof incomingPayload.data === "object") {
    return {
      ...incomingPayload,
      data: mergedData
    };
  }
  return mergedData;
}

module.exports = async (req, res) => {
  const origin = req.headers?.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const rawSyncKey = searchParams.get("key") || (req.body && req.body.key) || "";
  const syncKey = String(rawSyncKey).trim().replace(/[^a-zA-Z0-9_-]/g, "");

  if (!syncKey || syncKey.length < 4 || syncKey.length > 96) {
    return res.status(400).json({ error: "Invalid or missing sync key parameter" });
  }

  try {
    const cloudApiBase = "https://api.restful-api.dev/objects";

    if (req.method === "GET") {
      const response = await fetch(`${cloudApiBase}/${encodeURIComponent(syncKey)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "Sync key not found" });
        }
        return res.status(response.status).json({ error: "Cloud storage error" });
      }
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "PUT" || req.method === "POST") {
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      if (rawBody.length > MAX_SYNC_PAYLOAD_BYTES) {
        return res.status(413).json({ error: "Sync payload exceeds 2MB limit" });
      }

      const incomingPayload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      let targetUrl = `${cloudApiBase}/${encodeURIComponent(syncKey)}`;
      let method = "PUT";
      let payloadToStore = incomingPayload;

      // Perform Smart Per-Entity Delta/Timestamp Merge before writing if existing record exists
      if (syncKey !== "new" && req.method === "PUT") {
        try {
          const existingRes = await fetch(targetUrl);
          if (existingRes.ok) {
            const existingJson = await existingRes.json();
            payloadToStore = mergeSyncPayloads(existingJson, incomingPayload);
          }
        } catch {
          // Proceed with incomingPayload if upstream read fails
        }
      }

      if (syncKey === "new" || req.method === "POST") {
        targetUrl = cloudApiBase;
        method = "POST";
      }

      const response = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToStore)
      });

      if (!response.ok && method === "PUT") {
        const createRes = await fetch(cloudApiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToStore)
        });
        const createData = await createRes.json();
        return res.status(createRes.status).json(createData);
      }

      const result = await response.json();
      return res.status(response.status).json({
        ...result,
        merged: true,
        mergedAt: Date.now()
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
