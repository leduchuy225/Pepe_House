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

module.exports.validateDestination = (
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
  if (
    !coordinates ||
    coordinates.length !== 2 ||
    hasEmptyField(...coordinates)
  ) {
    errors.push("Invalid coordinate");
  }
  if (!tags || hasEmptyField(...tags)) {
    errors.push("Invalid tags");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};
