const { validateSignIn, validateSignUp } = require("../config/validator");
const { generateToken } = require("../config/helper");

const { BaseUser, Blogger } = require("../models/user.model");

const signUp = async (req, res) => {
  const { displayName, username, password, confirmPassword } = req.body;
  const { errors, valid } = validateSignUp(
    displayName,
    username,
    password,
    confirmPassword
  );

  try {
    if (!valid) {
      return res.json({ success: false, errors: errors });
    }

    const newBlogger = new Blogger({ displayName, username, password });

    await newBlogger.save();
    res.status(200).json({ success: true, data: { user: newBlogger } });
  } catch (err) {
    res.json({
      success: false,
      errors: [err?.message || "Something went wrong"],
    });
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = validateSignIn(username, password);
  const err = [];

  if (!valid) {
    return res.json({ success: false, errors: errors });
  }

  const user = await BaseUser.findOne({ username }, { password: 0 });

  if (!user) {
    err.push("Username is not found. Invalid login credentials");
    return res.status(404).json({
      success: false,
      errors: err,
    });
  }

  const accessToken = generateToken(user);

  return res.status(200).json({
    success: true,
    data: { user: { ...user.toObject(), token: accessToken } },
  });
};

const profile = (req, res) => {
  const { user } = req;
  res.status(200).json({ success: true, data: user });
};

module.exports = { signIn, signUp, profile };
