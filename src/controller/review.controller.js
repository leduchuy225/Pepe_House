const { isValidID } = require("../config/helper");
const { failureRes, successRes } = require("../config/response");
const { validateReview } = require("../config/validator");
const Review = require("../models/review.model");
const House = require("../models/house.model");

module.exports.postReview = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { content, point } = req.body;

  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }
  const { errors, valid } = validateReview(point, content);

  if (!valid) {
    return failureRes(req, res)([errors]);
  }

  const review = new Review({ point, content, author: _id });

  try {
    await review
      .save()
      .then((review) =>
        House.updateOne({ _id: id }, { $push: { reviews: review._id } })
      );
    console.log(review);
    return successRes(req, res)({ message: "Send review successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.delReview = async () => {};
