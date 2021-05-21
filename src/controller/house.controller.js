const { validateHouse } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../utils/cloudinary");
const House = require("../models/house.model");
const { isValidID } = require("../config/helper");
const { Role, HouseStatus } = require("../config/const");

module.exports.getHouseById = async (req, res) => {
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["House not found"]);
  }

  const house = await House.findOne({ _id: id });

  if (!house) {
    return failureRes(req, res)(["House not found"]);
  }

  if ([HouseStatus.PENDING, HouseStatus.REJECTED].includes(house.status)) {
    if (
      !req.user ||
      req.user?.role !== Role.ADMIN ||
      req.user?._id !== house.author
    ) {
      return failureRes(req, res)(["House not found"]);
    }
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
  const { name, address, description, coordinates, tags } = req.body;
  /* const { errors, valid } = validateHouse(
    name,
    address,
    description,
    coordinates,
    tags
  );

  if (!valid) {
    return failureRes(req, res)(errors);
  } */

  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  console.log("Upload images successfully");

  /* const house = new House({
    name,
    address,
    description,
    images: result.imageURL,
    coordinates,
    author: req.user._id,
    tags,
  });

  try {
    await house.save();
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  } */
};

module.exports.deleteHouse = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["House not found"]);
  }

  try {
    if (req.user.role === Role.ADMIN) {
      await House.deleteOne({ _id: id });
    } else {
      const delHouse = await House.deleteOne({
        _id: id,
        author: _id,
      });
      if (!delHouse.deletedCount) {
        return failureRes(req, res, 403)(["You can't delete this house"]);
      }
    }
    return successRes(req, res)({ message: "Delete house successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.getHouseList = async (req, res) => {};
