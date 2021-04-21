module.exports.getReviews = async () => {};

module.exports.postReview = async (req, res) => {
  const { _id } = req.user;
  const { content, point } = req.body;
};

module.exports.delReview = async () => {};
