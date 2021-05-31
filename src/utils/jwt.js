const jwt = require("jsonwebtoken");
const { env } = require("../config/const");

module.exports.generateToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });
};
