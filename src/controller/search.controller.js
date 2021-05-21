const House = require("../models/house.model");
const { successRes } = require("../config/response");

const LIMIT_DEFAULT = 3;

module.exports.search = async (req, res) => {
  const { keyword } = req.query;
  const regex = new RegExp(keyword, "i");
  const houses = await findHouses(regex);

  return successRes(req, res)({ houses });
};

const findHouses = async (regex, limit) => {
  return await House.find({
    name: { $regex: regex },
  }).limit(limit || LIMIT_DEFAULT);
};
