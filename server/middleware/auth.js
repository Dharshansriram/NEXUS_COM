import jwt from "jsonwebtoken";

export function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set (min 16 chars) in production");
  }
  return "dev-only-jwt-secret-change-me!!";
}

/**
 * Verifies Bearer JWT and sets req.user = { sub, email, username }
 * @param {boolean} required
 */
export function authMiddleware(required = true) {
  return (req, res, next) => {
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ") ? raw.slice(7).trim() : null;
    if (!token) {
      if (required) return res.status(401).json({ error: "Unauthorized" });
      req.user = null;
      return next();
    }
    try {
      req.user = jwt.verify(token, getJwtSecret());
      next();
    } catch {
      if (required) return res.status(401).json({ error: "Invalid or expired token" });
      req.user = null;
      next();
    }
  };
}
