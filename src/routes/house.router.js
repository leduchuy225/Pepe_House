const router = require("express").Router();
const houseController = require("../controller/house.controller");
const { validateFile } = require("../utils/multer");
const { authenticateToken } = require("../utils/jwt");

router.get("/details/:id", houseController.getHouseById);

router.get("/list", houseController.getHouseList);

router.post(
  "/create",
  // authenticateToken,
  validateFile,
  houseController.createHouse
);

router.delete("/delete/:id", authenticateToken, houseController.deleteHouse);

module.exports = router;
