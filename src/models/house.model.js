const { Schema, model } = require("mongoose");
const { HouseStatus } = require("../config/const");

const HouseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    enum: [
      HouseStatus.PENDING,
      HouseStatus.SELLING,
      HouseStatus.SOLD,
      HouseStatus.REJECTED,
    ],
    default: HouseStatus.PENDING,
  },
  // coordinates: { type: [Number], required: true },
  images: [{ type: String }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "BaseUser",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("House", HouseSchema);
