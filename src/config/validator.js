const { hasEmptyField } = require("./helper");

module.exports.validateSignIn = (username, password) => {
  const errors = [];

  if (hasEmptyField(username, password)) {
    errors.push("Username or password must not be empty");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

module.exports.validateSignUp = (
  displayName,
  username,
  password,
  confirmPassword
) => {
  const errors = [];
  if (hasEmptyField(displayName, username, password, confirmPassword)) {
    errors.push("Required fields are empty");
  } else if (password !== confirmPassword) {
    errors.push("Password must match with confirm password");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

module.exports.validateHouse = (
  name,
  address,
  description,
  coordinates,
  tags
) => {
  const errors = [];
  if (hasEmptyField(name, address, description)) {
    errors.push("Required fields are empty");
  }
  if (!coordinates || coordinates.length !== 2) {
    errors.push("Invalid coordinate");
  } else {
    for (const coordinate of coordinates) {
      if (!coordinate || isNaN(coordinate)) {
        errors.push("Invalid coordinate");
        break;
      }
    }
  }
  if (!tags || hasEmptyField(...tags)) {
    errors.push("Invalid tags");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};

module.exports.validateReview = (point, content) => {
  const errors = [];
  if (hasEmptyField(point, content)) {
    errors.push("Required fields are empty");
  }
  if (isNaN(point)) {
    errors.push("Invalid point");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};
