const mongoose = require("mongoose");

const isEmptyString = (str) => {
  if (!str || str.trim() === "") {
    return true;
  }
  return false;
};

module.exports.hasEmptyField = (...fields) => {
  for (const field of fields) {
    if (isEmptyString(field)) {
      return true;
    }
  }
  return false;
};

module.exports.isValidID = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
