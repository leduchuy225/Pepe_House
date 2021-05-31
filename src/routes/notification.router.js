const router = require("express").Router();
const { authenticateToken } = require("../config/middleware");
const notificationController = require("../controller/notification.controller");

router.get(
  "/",
  authenticateToken(),
  notificationController.getNotificationList
);

module.exports = router;
