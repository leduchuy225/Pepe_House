const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "BaseUser",
  },
  point: Number,
  content: {
    type: String,
    required: true,
  },
});

module.exports = model("Reivew", ReviewSchema);
