const jwt = require("jsonwebtoken");
const { env } = require("./const");

const generateToken = (user) => {
  return jwt.sign({ user }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, errors: ["Unauthorized"] });
  }

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, errors: ["Forbidden"] });
    }
    req.user = user;
    next();
  });
};

const authenticateRole = (roles) => (req, res, next) => {
  !roles.includes(req.user.role)
    ? res.status(401).json({ success: false, errors: ["Unauthorized"] })
    : next();
};

module.exports = { authenticateToken, generateToken };
