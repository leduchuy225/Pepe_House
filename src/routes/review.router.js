const router = require("express").Router();
const { authenticateToken } = require("../config/helper");
const reviewController = require("../controller/review.controller");

router.post("/post", authenticateToken, reviewController.postReview);

module.exports = router;
