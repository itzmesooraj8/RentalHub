import jwt from "jsonwebtoken";
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL SECURITY ERROR: JWT_SECRET environment variable is missing.");
    throw new Error("JWT_SECRET environment variable is missing. Please set JWT_SECRET in your environment or .env file.");
  }
  return secret;
}
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token is missing or malformed."
      }
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Authentication token is invalid or expired."
      }
    });
  }
};
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "User authentication is required."
        }
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Role '${req.user.role}' does not have permission for this resource. Required: [${allowedRoles.join(", ")}].`
        }
      });
    }
    next();
  };
};
export function generateToken(user) {
  const secret = getJwtSecret();
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    secret,
    { expiresIn: "7d" }
  );
}
