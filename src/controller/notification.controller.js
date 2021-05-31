const { successRes, failureRes } = require("../config/response");
const { BaseUser } = require("../models/user.model");

exports.saveNotification = async ({ userId, content }) => {
  console.log("New notification !!!");

  await new Notification({ content }).save().then(async (data) => {
    await BaseUser.updateOne(
      { _id: userId },
      { $push: { notifications: data._id } }
    );
  });
};

exports.getNotificationList = async (req, res) => {
  try {
    const notifications = await BaseUser.findOne(
      { _id: req.user._id },
      { displayName: 1, notifications: 1 }
    ).populate("notifications");
    return successRes(req, res)({ user: notifications });
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};
