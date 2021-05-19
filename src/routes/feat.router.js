const router = require("express").Router();
const { authenticateToken } = require("../utils/jwt");
const reviewController = require("../controller/review.controller");

router.post("/review/:id", authenticateToken, reviewController.postReview);

module.exports = router;
