const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { env } = require("./const");
const { failureRes } = require("./response");

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
  !roles.includes(req.user.role)
    ? failureRes(req, res, 403)(["Forbidden"])
    : next();
};

const isEmptyString = (str) => {
  if (!str || str.trim() === "") {
    return true;
  }
  return false;
};

module.exports.hasEmptyField = (...fields) => {
  for (const field of fields) {
    if (isEmptyString(field)) {
      return true;
    }
  }
  return false;
};

module.exports.fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback("Unsupported file format", false);
  }
};

module.exports.isValidID = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
