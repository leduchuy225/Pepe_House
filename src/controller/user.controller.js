const { validateSignIn, validateSignUp } = require("../config/validator");
const { generateToken, isValidID } = require("../config/helper");
const { BaseUser } = require("../models/user.model");
const Destionation = require("../models/house.model");
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
  const { user } = req;
  return successRes(req, res)({ user });
};

module.exports.myHouse = async (req, res) => {
  const { _id } = req.user;
  const houses = await Destionation.find({ author: _id });
  return successRes(req, res)({ houses });
};

module.exports.acceptHouse = async (req, res) => {
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  try {
    await Destionation.updateOne({ _id: id }, { accepted: true });
  } catch (error) {
    return failureRes(req, res)([err?.message]);
  }

  return successRes(req, res)({ message: "Destionation is accepted" });
};

module.exports.rejectHouse = async (req, res) => {
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  try {
    await Destionation.updateOne({ _id: id }, { accepted: false });
  } catch (error) {
    return failureRes(req, res)([err?.message]);
  }

  return successRes(req, res)({ message: "Destionation is rejected" });
};
