const { failureRes, successRes } = require("../config/response");
const { validateReview } = require("../config/validator");
const Review = require("../models/review.model");
const House = require("../models/house.model");

module.exports.postReview = async (req, res) => {
  const { content, point } = req.body;
  const { errors, valid } = validateReview({ point, content });
  if (!valid) return failureRes(req, res)([errors]);
  const review = new Review({ point, content, author: req.user._id });

  await review
    .save()
    .then(async (review) => {
      const response = await House.updateOne(
        { _id: req.params.houseId },
        { $push: { reviews: review._id } }
      );
      if (!response.nModified) throw new Error("House not found");
      return successRes(req, res)({ review });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.editReview = async (req, res) => {
  const { content, point } = req.body;
  const { errors, valid } = validateReview({ point, content });
  if (!valid) return failureRes(req, res)([errors]);
  await Review.findOneAndUpdate(
    { _id: req.params.reviewId },
    { point, content },
    () => {}
  )
    .then((data) => {
      if (!data) throw new Error("Review not found");
      return successRes(req, res)({ review: data });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.deleteReview = async (req, res) => {
  await Review.deleteOne({ _id: req.params.reviewId })
    .then((result) => {
      if (!result.deletedCount) throw new Error("Review not found");
      return successRes(req, res)({ message: "Delete review successfully" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};
