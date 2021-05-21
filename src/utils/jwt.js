const jwt = require("jsonwebtoken");
const { failureRes } = require("../config/response");

module.exports.generateToken = (user) => {
  return jwt.sign({ user }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
};

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return failureRes(req, res, 401)(["Unauthorized"]);
  }

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return failureRes(req, res, 403)(["Forbidden"]);
    }
    req.user = data.user;
    next();
  });
};

module.exports.authenticateRole = (roles) => (req, res, next) => {
  return !roles.includes(req.user.role)
    ? failureRes(req, res, 403)(["Forbidden"])
    : next();
};
