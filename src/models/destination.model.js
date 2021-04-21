const { Schema, model } = require("mongoose");

const DestinationSchema = new Schema({
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
});

module.exports = model("Destination", DestinationSchema);
