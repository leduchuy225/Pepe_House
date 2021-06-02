const router = require("express").Router();
const userController = require("../controller/user.controller");
const {
  authenticateToken,
  authenticateRole,
  isValidID,
} = require("../config/middleware");
const { Role } = require("../config/const");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.get("/profile", authenticateToken(), userController.profile);

router.get("/my-houses", authenticateToken(), userController.myHouse);

router.get(
  "/favorite/list",
  authenticateToken(),
  userController.getFavoriteList
);

router.put(
  "/add-favorite/:houseId",
  isValidID,
  authenticateToken(),
  userController.addToFavorite
);

router.put(
  "/remove-favorite/:houseId",
  isValidID,
  authenticateToken(),
  userController.removeFromFavorite
);

router.put(
  "/change-role/:userId",
  isValidID,
  authenticateToken(),
  authenticateRole([Role.ADMIN]),
  userController.changeUserRole
);

router.get(
  "/list",
  authenticateToken(),
  authenticateRole([Role.ADMIN]),
  userController.getUserList
);

router.get(
  "/notifications",
  authenticateToken(),
  userController.getNotificationList
);

module.exports = router;
