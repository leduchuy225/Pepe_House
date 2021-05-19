const { Schema, model } = require("mongoose");

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
  locationLabel: String,
  region: String,
  county: String,
  locality: String,
  tags: { type: [Number] },
  coordinates: { type: [Number], required: true },
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
  accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("House", HouseSchema);
