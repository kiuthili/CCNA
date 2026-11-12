// Vercel Serverless Function: /api/sync
// Supports syncing study notes across devices

module.exports = async (req, res) => {
  // Set CORS headers so any origin (including custom domains or preview URLs) can sync
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const syncKey = searchParams.get('key') || (req.body && req.body.key);

  if (!syncKey) {
    return res.status(400).json({ error: 'Missing sync key parameter' });
  }

  // If external REST storage or Vercel KV is configured via environment, we can use it.
  // Otherwise, proxy to public high-availability cloud storage
  try {
    const cloudApiBase = 'https://api.restful-api.dev/objects';

    if (req.method === 'GET') {
      const response = await fetch(`${cloudApiBase}/${encodeURIComponent(syncKey)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: 'Sync key not found' });
        }
        return res.status(response.status).json({ error: 'Cloud storage error' });
      }
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const payload = req.body;
      let targetUrl = `${cloudApiBase}/${encodeURIComponent(syncKey)}`;
      let method = 'PUT';

      // If syncKey is 'new' or doesn't look like an existing object ID, create a new one
      if (syncKey === 'new' || req.method === 'POST') {
        targetUrl = cloudApiBase;
        method = 'POST';
      }

      const response = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok && method === 'PUT') {
        // If not found on PUT, try POST to create
        const createRes = await fetch(cloudApiBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        return res.status(createRes.status).json(createData);
      }

      const result = await response.json();
      return res.status(response.status).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
