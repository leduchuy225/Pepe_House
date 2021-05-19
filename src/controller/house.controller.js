const { validateHouse } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../utils/cloudinary");
const Destionation = require("../models/house.model");
const { isValidID } = require("../config/helper");
const { Role } = require("../config/const");

module.exports.getHouseById = async (req, res) => {
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  const house = await Destionation.findOne({ _id: id });

  if (!house) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  if (!house.accepted) {
    if (
      !req.user ||
      req.user?.role !== Role.ADMIN ||
      req.user?._id !== house.author
    ) {
      return failureRes(req, res)(["Destionation not found"]);
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
  const { _id } = req.user;
  const { name, address, description, coordinates, tags } = req.body;
  const { errors, valid } = validateHouse(
    name,
    address,
    description,
    coordinates,
    tags
  );

  if (!valid) {
    return failureRes(req, res)(errors);
  }

  let accepted = false;
  if (req.user?.role === Role.ADMIN) {
    accepted = true;
  }

  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  console.log("Upload images successfully");

  const { url } = result;
  const house = new Destionation({
    name,
    address,
    description,
    images: [url],
    coordinates,
    author: _id,
    accepted,
    tags,
  });

  try {
    await house.save();
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.deleteDestionation = async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  const { id } = req.params;
  if (!isValidID(id)) {
    return failureRes(req, res)(["Destionation not found"]);
  }

  try {
    const delHouse = await Destionation.deleteOne({
      _id: id,
      author: _id,
      accepted: false,
    });
    if (!delHouse.deletedCount) {
      return failureRes(req, res)(["You can't delete this house"]);
    }
    return successRes(
      req,
      res
    )({ message: "Delete destionation successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.getDestionationList = async (req, res) => {};
