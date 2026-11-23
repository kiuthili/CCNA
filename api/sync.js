// Vercel Serverless Function: /api/sync
// Supports syncing study notes, highlights, bookmarks, flashcards & progress across devices
// Enforces payload size validation, key format validation, and compliant CORS headers

const MAX_SYNC_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2 MB limit

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

      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      let targetUrl = `${cloudApiBase}/${encodeURIComponent(syncKey)}`;
      let method = "PUT";

      if (syncKey === "new" || req.method === "POST") {
        targetUrl = cloudApiBase;
        method = "POST";
      }

      const response = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok && method === "PUT") {
        const createRes = await fetch(cloudApiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        return res.status(createRes.status).json(createData);
      }

      const result = await response.json();
      return res.status(response.status).json(result);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
