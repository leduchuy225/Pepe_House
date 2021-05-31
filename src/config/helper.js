const House = require("../models/house.model");

const isEmptyString = (str) => {
  if (!str || str.toString().trim() === "") return true;
  return false;
};

module.exports.hasEmptyField = (...fields) => {
  for (const field of fields) {
    if (isEmptyString(field)) return true;
  }
  return false;
};

module.exports.isHouseOwner = async (houseId, userID) => {
  const house = await House.findOne({ _id: houseId, author: userID });
  return house ? true : false;
};

module.exports.isReviewOwner = async (reviewId, userID) => {
  const review = await Review.findOne({ _id: reviewId, author: userID });
  return review ? true : false;
};
