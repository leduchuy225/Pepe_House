const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema({
  content: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

module.exports = model("Notification", NotificationSchema);
