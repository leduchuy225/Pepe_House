const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Role } = require("../config/const");
const { isHouseOwner, isReviewOwner } = require("../config/helper");
const { failureRes } = require("../config/response");
const { env } = require("../config/const");

module.exports.isValidID = (req, res, next) => {
  const id =
    req.params.id ||
    req.params.userId ||
    req.params.houseId ||
    req.params.reviewId;
  mongoose.Types.ObjectId.isValid(id)
    ? next()
    : failureRes(req, res)(["Not found"]);
};

module.exports.authenticateToken =
  (withoutToken = false) =>
  (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token && !withoutToken) {
      return failureRes(req, res, 401)(["Unauthorized"]);
    } else if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
          return failureRes(req, res, 403)(["Forbidden"]);
        }
        req.user = data.user;
        next();
      });
    } else next();
  };

module.exports.authenticateRole = (roles) => (req, res, next) => {
  return !roles.includes(req.user.role)
    ? failureRes(req, res, 403)(["Forbidden"])
    : next();
};

module.exports.authenticateOwner =
  (type, adminPermisson = true) =>
  (req, res, next) => {
    if (req.user.role === Role.ADMIN && adminPermisson) return next();
    else if (type === "house") {
      isHouseOwner(req.params.id, req.user._id)
        ? next()
        : failureRes(req, res, 401)(["Unauthorized"]);
    } else if (type === "review") {
      isReviewOwner(req.params.id, req.user._id)
        ? next()
        : failureRes(req, res, 401)(["Unauthorized"]);
    } else failureRes(req, res, 401)(["Unauthorized"]);
  };
