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
    return failureRes(req, res)(["House not found"]);
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

module.exports.delReview = async (req, res) => {
  const { id } = req.params;

  if (!isValidID(id)) {
    return failureRes(req, res)(["Review not found"]);
  }

  try {
    if (req.user.role === Role.ADMIN) {
      await Review.deleteOne({ _id: id });
    } else {
      const delReview = await Review.deleteOne({
        _id: id,
        author: _id,
      });
      if (!delReview.deletedCount) {
        return failureRes(req, res, 403)(["You can't delete this review"]);
      }
    }
    return successRes(req, res)({ message: "Delete review successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};
