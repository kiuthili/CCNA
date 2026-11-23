// ============================================================================
// Vercel / Node.js Serverless Function: /api/auth
// Multi-User Authentication Gateway with HMAC-SHA256 Signed Session Tokens
// - Validates credentials against server environment variables:
//   - CCNA_AUTH_USERS (JSON array of { username, passwordHash|password, displayName, role })
//   - or default admin / student accounts with SHA-256 verification
// - Signs stateless session tokens with HMAC-SHA256 (CCNA_AUTH_SECRET)
// - Returns isolated userId & cloudSyncKey per student account
// ============================================================================

const crypto = require("crypto");

const AUTH_SALT = process.env.CCNA_AUTH_SALT || "ccna_auth_v1_2026";
const DEFAULT_ADMIN_HASH = process.env.CCNA_ADMIN_HASH || "04e7ca8de21d616b80eaa340a06f7ffceb6a3ca22425cbf813b0fb09a4a7f783";
const HMAC_SECRET = process.env.CCNA_AUTH_SECRET || "ccna_academy_hmac_secret_2026_v2";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sha256Hex(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

function hashCredentials(username, password) {
  const raw = `${String(username).trim().toLowerCase()}:${String(password)}::${AUTH_SALT}`;
  return sha256Hex(raw);
}

function base64UrlEncode(str) {
  return Buffer.from(str, "utf8").toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function signSessionToken(payload) {
  const headerB64 = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "CCNA-JWT" }));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const sig = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${data}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function loadConfiguredUsers() {
  const users = [];
  if (process.env.CCNA_AUTH_USERS) {
    try {
      const parsed = JSON.parse(process.env.CCNA_AUTH_USERS);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          if (u && u.username) {
            users.push({
              username: String(u.username).trim().toLowerCase(),
              passwordHash: u.passwordHash || (u.password ? hashCredentials(u.username, u.password) : ""),
              displayName: u.displayName || u.username,
              role: u.role || "student"
            });
          }
        });
      }
    } catch {
      // Ignore malformed env JSON
    }
  }

  // Built-in student demo accounts for multi-user isolation testing
  const defaultStudents = [
    { username: "student1", passwordHash: hashCredentials("student1", "ccna2026"), displayName: "Học viên CCNA #1", role: "student" },
    { username: "student2", passwordHash: hashCredentials("student2", "ccna2026"), displayName: "Học viên CCNA #2", role: "student" }
  ];

  defaultStudents.forEach((ds) => {
    if (!users.some((u) => u.username === ds.username)) {
      users.push(ds);
    }
  });

  return users;
}

function deriveSyncKey(userId) {
  const baseKey = "ccna_acc_" + DEFAULT_ADMIN_HASH.substring(0, 24);
  if (userId === "admin" || userId === "default_user") return baseKey;
  return `${baseKey}_${userId}`;
}

module.exports = async (req, res) => {
  const origin = req.headers?.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, X-CSRF-Token, X-Requested-With, Accept, Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verify existing HMAC token
  if (req.method === "GET") {
    const authHeader = req.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const decoded = verifySessionToken(token);
    if (!decoded) {
      return res.status(401).json({ authenticated: false, error: "Invalid or expired session token" });
    }
    return res.status(200).json({
      authenticated: true,
      user: {
        userId: decoded.sub,
        username: decoded.username,
        displayName: decoded.displayName,
        role: decoded.role,
        syncKey: decoded.syncKey
      }
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!username || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." });
    }

    const computedHash = hashCredentials(username, password);
    let matchedUser = null;

    // 1. Check primary admin hash
    if (computedHash === DEFAULT_ADMIN_HASH) {
      matchedUser = {
        userId: username.replace(/[^a-z0-9_-]/g, "_") || "admin",
        username,
        displayName: username === "admin" ? "Quản trị viên CCNA" : username,
        role: "admin"
      };
    }

    // 2. Check configured multi-user accounts
    if (!matchedUser) {
      const users = loadConfiguredUsers();
      const found = users.find((u) => u.username === username && u.passwordHash === computedHash);
      if (found) {
        matchedUser = {
          userId: found.username.replace(/[^a-z0-9_-]/g, "_"),
          username: found.username,
          displayName: found.displayName,
          role: found.role
        };
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ error: "Tài khoản hoặc mật khẩu không đúng." });
    }

    const syncKey = deriveSyncKey(matchedUser.userId);
    const now = Date.now();
    const token = signSessionToken({
      sub: matchedUser.userId,
      username: matchedUser.username,
      displayName: matchedUser.displayName,
      role: matchedUser.role,
      syncKey,
      iat: now,
      exp: now + TOKEN_TTL_MS
    });

    return res.status(200).json({
      authenticated: true,
      token,
      authHash: computedHash,
      user: {
        ...matchedUser,
        syncKey
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Authentication server error" });
  }
};
