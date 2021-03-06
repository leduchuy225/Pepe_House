const { validateSignIn, validateSignUp } = require("../config/validator");
const { generateToken } = require("../utils/jwt");
const { BaseUser } = require("../models/user.model");
const House = require("../models/house.model");
const { failureRes, successRes } = require("../config/response");
const { saveNotification } = require("../config/helper");
const { clearHash } = require("../utils/redis");
const { RoleText } = require("../config/const");

module.exports.signUp = async (req, res) => {
  const { displayName, username, phone, role, password, confirmPassword } =
    req.body;
  const { errors, valid } = validateSignUp({
    displayName,
    username,
    phone,
    password,
    confirmPassword,
  });
  if (!valid) return failureRes(req, res)(errors);
  const user = await BaseUser.findOne({ username });
  if (user) {
    return failureRes(req, res)(["Username already exists"]);
  }
  const commonUser = new BaseUser({
    displayName,
    username,
    phone,
    role,
    password,
  });
  try {
    await commonUser.save();
    return successRes(req, res)({ user: commonUser });
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.signIn = async (req, res) => {
  console.log("Sign in:", req.body);
  const { username, password } = req.body;
  const { errors, valid } = validateSignIn({ username, password });
  const err = [];
  if (!valid) return failureRes(req, res, 401)(errors);
  const user = await BaseUser.findOne(
    { username, password },
    { password: 0, notifications: 0, favorite: 0 }
  );
  if (!user) {
    err.push("Invalid login credentials");
    return failureRes(req, res)(err);
  }
  const accessToken = generateToken(user);
  const userInfo = { ...user.toObject(), token: accessToken };
  return successRes(req, res)({ user: userInfo });
};

module.exports.profile = async (req, res) => {
  return successRes(req, res)({ user: req.user });
};

module.exports.myHouse = async (req, res) => {
  await House.find({ author: req.user._id }, { author: 0, reviews: 0 })
    .then((houses) => successRes(req, res)({ houses }))
    .catch((err) => failureRes(req, res)([err?.message]));
};

module.exports.changeUserRole = async (req, res) => {
  await BaseUser.updateOne({ _id: req.params.userId }, { role: req.body.role })
    .then(async (result) => {
      if (!result.nModified) throw new Error("Your role hasn't changed");
      await saveNotification({
        userId: req.params.userId,
        content: `Your role has been changed to ${RoleText[req.body.role]}`,
      });
      return successRes(req, res)({ message: "Change user role successfully" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.addToFavorite = async (req, res) => {
  await BaseUser.updateOne(
    { _id: req.user._id },
    { $addToSet: { favorite: req.params.houseId } }
  )
    .then((res) => {
      if (!res.nModified) throw new Error("Already like this house");
      return successRes(req, res)({ message: "Added to favorite list" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.removeFromFavorite = async (req, res) => {
  await BaseUser.updateOne(
    { _id: req.user._id },
    { $pull: { favorite: req.params.houseId } }
  )
    .then((res) => {
      if (!res.nModified) throw new Error("This isn't in your favorite list");
      return successRes(req, res)({ message: "Removed from favorite list" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.getFavoriteList = async (req, res) => {
  await BaseUser.findOne({ _id: req.user._id }, { displayName: 1, favorite: 1 })
    .populate("favorite")
    .then((data) => successRes(req, res)({ user: data }))
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.getNotificationList = async (req, res) => {
  await BaseUser.findOne(
    { _id: req.user._id },
    { displayName: 1, notifications: 1 }
  )
    .populate({ path: "notifications", options: { sort: { createAt: -1 } } })
    .then((data) => successRes(req, res)({ user: data }))
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.getUserList = async (req, res) => {
  await BaseUser.find(
    {},
    { favorite: 0, notifications: 0, password: 0, myHouse: 0 }
  )
    .then((users) => successRes(req, res)({ users }))
    .catch((error) => failureRes(req, res)([error?.message]));
};
