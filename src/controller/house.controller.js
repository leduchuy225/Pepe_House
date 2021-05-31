const House = require("../models/house.model");
const { validateHouse } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../utils/cloudinary");
const { Role, HouseStatus, PAGE, PER_PAGE } = require("../config/const");
const { saveNotification } = require("./notification.controller");

module.exports.getHouseById = async (req, res) => {
  const house = await House.findOne({
    _id: req.params.houseId,
  });
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
    .populate("author", "displayName phone")
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
  const { name, address, description, price, area, contact, phone } = req.body;
  const { errors, valid } = validateHouse({
    name,
    address,
    description,
    price,
    area,
    phone,
  });
  if (!valid) return failureRes(req, res)(errors);
  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  const house = new House({
    name,
    address,
    description,
    price,
    area,
    contact,
    phone,
    images: result,
    author: req.user._id,
  });
  try {
    await house.save().then((data) => {
      saveNotification({
        userId: req.user._id,
        content: `A house ${data.name} with id ${data._id} was created`,
      });
    });
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.editHouse = async (req, res) => {
  const { name, address, description, price, area, contact, phone } = req.body;
  /* const { errors, valid } = validateHouse({
    name,
    address,
    description,
    price,
    area,
    phone,
  });
  if (!valid) return failureRes(req, res)(errors); */
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
        price,
        status: HouseStatus.PENDING,
        images: result,
      },
      (err, data) => {
        saveNotification({
          userId: data.author,
          content: `House ${data.name} with id ${data._id} was updated`,
        });
      }
    );
    return successRes(req, res)(house);
  } catch (err) {
    return failureRes(req, res)([err?.message]);
  }
};

module.exports.deleteHouse = async (req, res) => {
  try {
    await House.findOneAndDelete({ _id: req.params.houseId }, (err, data) => {
      saveNotification({
        userId: data.author,
        content: `House ${data.name} with id ${data._id} was deleted`,
      });
    });
    return successRes(req, res)({ message: "Delete house successfully" });
  } catch (error) {
    return failureRes(req, res)([error?.message]);
  }
};

module.exports.changeHouseStatus = async (req, res) => {
  try {
    await House.findOneAndUpdate(
      { _id: req.params.houseId },
      { status: req.body.status },
      (err, data) => {
        saveNotification({
          userId: data.author,
          content: `House ${data.name} with id ${data._id} was changed status`,
        });
      }
    );
  } catch (error) {
    return failureRes(req, res)([err?.message]);
  }
  return successRes(req, res)({ message: "Change house status successfully" });
};

module.exports.searchHouse = async (req, res) => {
  const regex = new RegExp(req.query.keyword, "i");
  const page = parseInt(req.query?.page || PAGE);
  const perPage = parseInt(req.query?.perPage || PER_PAGE);
  const order = parseInt(req.query?.order || -1);
  const sortBy = req.query?.sortBy || "createAt";

  let option = { name: { $regex: regex } };
  if (req.user?.role !== Role.ADMIN) {
    option = {
      ...option,
      status: { $in: [HouseStatus.SELLING, HouseStatus.SOLD] },
    };
  }
  const houses = await House.find(option)
    .sort({ [sortBy]: [order] })
    .skip(page * perPage - perPage)
    .limit(perPage);
  return successRes(req, res)({ houses }, { page, perPage, sortBy, order });
};
