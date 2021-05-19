module.exports.successRes = (req, res) => {
  return (data) => {
    return res.status(200).json({
      success: true,
      data: data,
    });
  };
};

module.exports.failureRes = (req, res, status) => {
  return (err) => {
    if (!err.length) {
      err.push("Something went wrong. Please try again");
    }
    return res.status(status || 404).json({
      success: false,
      errors: { err },
    });
  };
};
