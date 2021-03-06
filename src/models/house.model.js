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
  position: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  status: {
    type: Number,
    enum: [HouseStatus.PENDING, HouseStatus.SELLING, HouseStatus.SOLD],
    default: HouseStatus.PENDING,
  },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  contact: String,
  phone: String,
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

HouseSchema.index({ position: "2dsphere" });

module.exports = model("House", HouseSchema);
