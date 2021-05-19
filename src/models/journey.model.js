const { Schema, model } = require("mongoose");

const JourneyType = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "BaseUser",
  },
  cost: Number,
  houses: [
    {
      departureTime: Date,
      house: {
        type: Schema.Types.ObjectId,
        ref: "House",
      },
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = model("Journey", JourneyType);

/* Project.find(query)
  .populate({
    path: "pages",
    populate: {
      path: "components",
      model: "Component",
    },
  })
  .exec(function (err, docs) {}); */
