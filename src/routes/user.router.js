const router = require("express").Router();
const userController = require("../controller/user.controller");
const { authenticateToken, authenticateRole } = require("../config/middleware");
const { Role } = require("../config/const");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.get("/profile", authenticateToken(), userController.profile);

router.get(
  "/my-house",
  authenticateToken(),
  authenticateRole([Role.ADMIN, Role.SELLER]),
  userController.myHouse
);

router.put(
  "/change-role/:userId",
  authenticateToken(),
  authenticateRole([Role.ADMIN]),
  userController.changeUserRole
);

module.exports = router;
