const router = require("express").Router();
const houseController = require("../controller/house.controller");
const { validateFile } = require("../utils/multer");
const {
  isValidID,
  authenticateToken,
  authenticateOwner,
  authenticateRole,
} = require("../config/middleware");
const { Role } = require("../config/const");

router.get("/search/recommendation", houseController.searchRecommendHouse);
router.get("/search", authenticateToken(true), houseController.searchHouse);

router.get(
  "/details/:houseId",
  isValidID,
  authenticateToken(true),
  houseController.getHouseById
);

router.post(
  "/create",
  authenticateToken(),
  authenticateRole([Role.ADMIN, Role.SELLER]),
  validateFile,
  houseController.createHouse
);

router.put(
  "/edit/:houseId",
  isValidID,
  authenticateToken(),
  authenticateRole([Role.ADMIN, Role.SELLER]),
  authenticateOwner("house", false),
  validateFile,
  houseController.editHouse
);

router.delete(
  "/delete/:houseId",
  isValidID,
  authenticateToken(),
  authenticateOwner("house", false),
  houseController.deleteHouse
);

router.put(
  "/change-status/:houseId",
  isValidID,
  authenticateToken(),
  authenticateRole([Role.ADMIN, Role.SELLER]),
  authenticateOwner("house"),
  houseController.changeHouseStatus
);

module.exports = router;
