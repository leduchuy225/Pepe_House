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
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  contact: String,
  phone: String,
  // coordinates: { type: [Number], required: true },
  images: [{ type: String }],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "BaseUser",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
  },
});

module.exports = model("House", HouseSchema);
