const router = require("express").Router();
const destinationController = require("../controller/destination.controller");
const { validateFile } = require("../config/multer");
const { authenticateToken } = require("../config/helper");

router.get("/details/:id", destinationController.getDestinationById);

router.post(
  "/create",
  authenticateToken,
  validateFile,
  destinationController.createDestination
);

router.delete(
  "/delete/:id",
  authenticateToken,
  destinationController.deleteDestionation
);

module.exports = router;
