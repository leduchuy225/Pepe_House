const { hasEmptyField } = require("./helper");

module.exports.validateSignIn = ({ username, password }) => {
  const errors = [];

  if (hasEmptyField(username, password)) {
    errors.push("Username or password must not be empty");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

module.exports.validateSignUp = ({
  displayName,
  username,
  phone,
  password,
  confirmPassword,
}) => {
  const errors = [];
  if (phone && !phone.match(/^[0-9]+$/)) {
    errors.push("Invalid phone number");
  } else if (hasEmptyField(displayName, username, password, confirmPassword)) {
    errors.push("Required fields are empty");
  } else if (password !== confirmPassword) {
    errors.push("Password must match with confirm password");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

module.exports.validateHouse = ({
  name,
  address,
  description,
  price,
  area,
  phone,
  long,
  lat,
}) => {
  const errors = [];
  if (hasEmptyField(name, address, description, price, area)) {
    errors.push("Required fields are empty");
  } else if (isNaN(price) || isNaN(area) || isNaN(long) || isNaN(lat)) {
    errors.push("Wrong type");
  } else if (phone && !phone.match(/^[0-9]+$/)) {
    errors.push("Invalid phone number");
  }

  return { errors, valid: errors.length < 1 };
};

module.exports.validateReview = ({ point, content }) => {
  const errors = [];
  if (hasEmptyField(point, content)) {
    errors.push("Required fields are empty");
  }
  if (isNaN(point)) {
    errors.push("Invalid point");
  }

  return { errors, valid: errors.length < 1 };
};
