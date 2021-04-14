const router = require("express").Router();
const userController = require("../controller/user.controller");
const { authenticateToken } = require("../config/helper");

router.post("/sign-up", userController.signUp);

router.post("/sign-in", userController.signIn);

router.get("/profile", authenticateToken, userController.profile);

module.exports = router;
