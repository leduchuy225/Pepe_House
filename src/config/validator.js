module.exports.validateSignIn = (username, password) => {
  const errors = [];

  if (!username || !password) {
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
  let errors = [];

  if (!username) {
    errors.push("Username must not be empty");
  }
  if (!displayName) {
    errors.push("Display name must not be empty");
  }
  if (!password) {
    errors.push("Password must not be empty");
  } else if (password !== confirmPassword) {
    errors.push("Password must match with confirm password");
  }

  return {
    errors,
    valid: errors.length < 1,
  };
};
