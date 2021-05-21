const router = require("express").Router();
const userController = require("../controller/user.controller");
const { authenticateToken, authenticateRole } = require("../utils/jwt");
const { Role } = require("../config/const");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.post(
  "/change-status/:id",
  authenticateToken,
  authenticateRole([Role.ADMIN, Role.SELLER]),
  userController.changeHouseStatus
);

router.get("/profile", authenticateToken, userController.profile);

router.get("/my-house", authenticateToken, userController.myHouse);

module.exports = router;
