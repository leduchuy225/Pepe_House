const { failureRes, successRes } = require("../config/response");
const { validateReview } = require("../config/validator");
const Review = require("../models/review.model");
const House = require("../models/house.model");

module.exports.postReview = async (req, res) => {
  const { content, point } = req.body;
  const { errors, valid } = validateReview({ point, content });
  if (!valid) return failureRes(req, res)([errors]);
  const review = new Review({ point, content, author: req.user._id });
  try {
    await review.save().then(async (review) => {
      await House.updateOne(
        { _id: req.params.houseId },
        { $push: { reviews: review._id } }
      );
    });
    return successRes(req, res)({ review });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.editReview = async (req, res) => {
  const { content, point } = req.body;
  const { errors, valid } = validateReview({ point, content });
  if (!valid) return failureRes(req, res)([errors]);
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId },
      { point, content }
    );
    return successRes(req, res)({ review });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    await Review.deleteOne({ _id: req.params.reviewId });
    return successRes(req, res)({ message: "Delete review successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};
