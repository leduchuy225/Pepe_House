const router = require("express").Router();
const userController = require("../controller/user.controller");
const { authenticateToken, authenticateRole } = require("../utils/jwt");
const { Role } = require("../config/const");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.put(
  "/accept/:id",
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  userController.acceptHouse
);

router.put(
  "/reject/:id",
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  userController.rejectHouse
);

router.get("/profile", authenticateToken, userController.profile);

router.get("/my-house", authenticateToken, userController.myHouse);

module.exports = router;
