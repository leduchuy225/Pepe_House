const router = require("express").Router();
const { authenticateToken } = require("../utils/jwt");
const reviewController = require("../controller/review.controller");

router.post("/review/:id", authenticateToken, reviewController.postReview);

router.put("/review/:id", authenticateToken, reviewController.editReview);

router.delete("/review/:id", authenticateToken, reviewController.deleteReview);

module.exports = router;
