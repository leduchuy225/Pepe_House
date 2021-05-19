const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "BaseUser",
  },
  point: { type: Number, required: true },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Review", ReviewSchema);
