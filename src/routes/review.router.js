const router = require("express").Router();
const reviewController = require("../controller/review.controller");
const {
  isValidID,
  authenticateToken,
  authenticateOwner,
} = require("../config/middleware");

router.post(
  "/create/:houseId",
  isValidID,
  authenticateToken(),
  reviewController.postReview
);

router.put(
  "/edit/:reviewId",
  isValidID,
  authenticateToken(),
  authenticateOwner,
  reviewController.editReview
);

router.delete(
  "/delete/:reviewId",
  isValidID,
  authenticateToken(),
  authenticateOwner,
  reviewController.deleteReview
);

module.exports = router;
