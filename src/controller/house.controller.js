const { validateHouse } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../utils/cloudinary");
const House = require("../models/house.model");
const { Role, HouseStatus } = require("../config/const");

module.exports.getHouseById = async (req, res) => {
  const house = await House.findOne({ _id: req.params.houseId });
  if (!house) return failureRes(req, res)(["House not found"]);
  if ([HouseStatus.PENDING, HouseStatus.REJECTED].includes(house.status)) {
    if (
      !req.user ||
      (req.user?.role !== Role.ADMIN &&
        req.user?._id !== house.author.toString())
    )
      return failureRes(req, res)(["House not found"]);
  }
  await house
    .populate("author", "displayName")
    .populate({
      path: "reviews",
      options: {
        sort: { createAt: -1 },
        populate: { path: "author", select: "displayName" },
      },
    })
    .execPopulate();
  return successRes(req, res)(house);
};

module.exports.createHouse = async (req, res) => {
  const { name, address, description } = req.body;
  const { errors, valid } = validateHouse(name, address, description);
  if (!valid) {
    return failureRes(req, res)(errors);
  }
  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  const house = new House({
    name,
    address,
    description,
    images: result,
    author: req.user._id,
  });
  try {
    await house.save();
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.editHouse = async (req, res) => {
  const { name, address, description } = req.body;
  const { errors, valid } = validateHouse(name, address, description);
  if (!valid) {
    return failureRes(req, res)(errors);
  }
  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  try {
    const house = await House.findOneAndUpdate(
      { _id: req.params.houseId },
      {
        name,
        address,
        description,
        images: result.imageURL,
      }
    );
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.deleteHouse = async (req, res) => {
  try {
    await House.deleteOne({ _id: req.params.houseId });
    return successRes(req, res)({ message: "Delete house successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.changeHouseStatus = async (req, res) => {
  try {
    await House.updateOne(
      { _id: req.params.houseId },
      { status: req.body.status }
    );
  } catch (error) {
    return failureRes(req, res)([err?.message]);
  }
  return successRes(req, res)({ message: "Change house status successfully" });
};
