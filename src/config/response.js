module.exports.successRes = (req, res) => {
  return (data, pagination = null) => {
    let response = { success: true, data: data };
    if (pagination) response = { ...response, pagination };
    return res.status(200).json(response);
  };
};

module.exports.failureRes = (req, res, status) => {
  return (err) => {
    if (!err.length) err.push("Something went wrong. Please try again");
    return res.status(status || 404).json({
      success: false,
      errors: { err },
    });
  };
};
