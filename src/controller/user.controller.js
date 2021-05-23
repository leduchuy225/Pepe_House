const { validateSignIn, validateSignUp } = require("../config/validator");
const { generateToken } = require("../utils/jwt");
const { BaseUser } = require("../models/user.model");
const House = require("../models/house.model");
const { failureRes, successRes } = require("../config/response");

module.exports.signUp = async (req, res) => {
  const { displayName, username, password, confirmPassword } = req.body;
  const { errors, valid } = validateSignUp(
    displayName,
    username,
    password,
    confirmPassword
  );
  if (!valid) {
    return failureRes(req, res)(errors);
  }
  const user = await BaseUser.findOne({ username });
  if (user) {
    return failureRes(req, res)(["Username already exists"]);
  }
  const commonUser = new BaseUser({ displayName, username, password });
  try {
    await commonUser.save();
    return successRes(req, res)({ user: commonUser });
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.signIn = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = validateSignIn(username, password);
  const err = [];
  if (!valid) {
    return failureRes(req, res, 401)(errors);
  }
  const user = await BaseUser.findOne({ username }, { password: 0 });
  if (!user) {
    err.push("Username is not found. Invalid login credentials");
    return failureRes(req, res)(err);
  }
  const accessToken = generateToken(user);
  const userInfo = { ...user.toObject(), token: accessToken };
  return successRes(req, res)({ user: userInfo });
};

module.exports.profile = (req, res) => {
  return successRes(req, res)({ user: req.user });
};

module.exports.myHouse = async (req, res) => {
  const houses = await House.find({ author: req.user._id });
  return successRes(req, res)({ houses });
};

module.exports.changeUserRole = async (req, res) => {
  try {
    await BaseUser.updateOne(
      { _id: req.params.userId },
      { role: req.body.role }
    );
  } catch (error) {
    return failureRes(req, res)([err?.message]);
  }
  return successRes(req, res)({ message: "Change user role successfully" });
};
