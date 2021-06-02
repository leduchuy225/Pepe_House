const House = require("../models/house.model");
const { validateHouse } = require("../config/validator");
const { failureRes, successRes } = require("../config/response");
const { uploadFile } = require("../utils/cloudinary");
const {
  Role,
  HouseStatus,
  PAGE,
  PER_PAGE,
  HouseStatusText,
} = require("../config/const");
const { saveNotification } = require("../config/helper");
const { BaseUser } = require("../models/user.model");
const { clearHash } = require("../utils/redis");

module.exports.getHouseById = async (req, res) => {
  const house = await House.findOne(
    { _id: req.params.houseId },
    { _id: 1, status: 1 }
  );
  if (!house) return failureRes(req, res)(["House not found"]);
  if (HouseStatus.PENDING === house.status) {
    if (
      !req.user ||
      (req.user?.role !== Role.ADMIN &&
        req.user?._id !== house.author.toString())
    )
      return failureRes(req, res)(["House not found"]);
  }
  await House.findOne({
    _id: req.params.houseId,
  })
    .populate("author", "displayName phone")
    .populate({
      path: "reviews",
      options: {
        sort: { createAt: -1 },
        populate: { path: "author", select: "displayName" },
      },
    })
    .cache({ key: "house-detail", expire: 60 * 5 })
    .then(async (data) => {
      let user;
      if (req.user) {
        user = await BaseUser.findOne(
          {
            _id: req.user._id,
            favorite: {
              $elemMatch: { $eq: req.params.houseId },
            },
          },
          { _id: 1 }
        );
      }
      return successRes(
        req,
        res
      )({ ...data.toObject(), liked: user ? true : false });
    })
    .catch((err) => failureRes(req, res)([err?.message]));
};

module.exports.createHouse = async (req, res) => {
  const { name, address, description, price, area, contact, phone, long, lat } =
    req.body;
  const { errors, valid } = validateHouse({
    name,
    address,
    description,
    price,
    area,
    phone,
    long,
    lat,
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
    position: { coordinates: [parseFloat(long), parseFloat(lat)] },
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
  const { name, address, description, price, area, contact, phone, long, lat } =
    req.body;
  const { errors, valid } = validateHouse({
    name,
    address,
    description,
    price,
    area,
    phone,
    long,
    lat,
  });
  if (!valid) return failureRes(req, res)(errors);
  const { result, success } = await uploadFile(req, name);
  if (!success) {
    return failureRes(req, res)(result);
  }
  try {
    await clearHash("house-detail");

    const house = await House.findOneAndUpdate(
      { _id: req.params.houseId },
      {
        name,
        address,
        description,
        price,
        area,
        contact,
        phone,
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
  await House.findOneAndDelete({ _id: req.params.houseId })
    .then(async (data) => {
      await saveNotification({
        userId: data.author,
        content: `House ${data.name} with id ${data._id} was deleted`,
      });
      return successRes(req, res)({ message: "Delete house successfully" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.changeHouseStatus = async (req, res) => {
  await House.findOneAndUpdate(
    { _id: req.params.houseId },
    { status: req.body.status }
  )
    .then(async (data) => {
      await saveNotification({
        userId: data.author,
        content: `House ${data.name} with id ${
          data._id
        } was changed status to ${
          HouseStatusText[HouseStatus[req.body.status]]
        }`,
      });
      return successRes(
        req,
        res
      )({ message: "Change house status successfully" });
    })
    .catch((error) => failureRes(req, res)([error?.message]));
};

module.exports.searchHouse = async (req, res) => {
  const regex = new RegExp(req.query.keyword, "i");
  const perPage = parseInt(req.query?.perPage) || PER_PAGE;
  const order = parseInt(req.query?.order) || -1;
  const page = parseInt(req.query?.page) || PAGE;
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

module.exports.searchRecommendHouse = async (req, res) => {
  const maxDistance = parseFloat(req.query.maxDistance);
  const long = parseFloat(req.query.long);
  const lat = parseFloat(req.query.lat);

  if (!long || !lat) return failureRes(req, res)(["Required fields are empty"]);

  await House.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long, lat],
        },
        distanceField: "dist.calculated",
        maxDistance: maxDistance || 1 * 1000, // meters
        spherical: true,
      },
    },
    { $project: { reviews: 0, author: 0 } },
  ])
    .cache({ key: "near-house", expire: 60 * 5 })
    .then((data) => {
      return successRes(req, res)({ houses: data });
    })
    .catch((err) => {
      return failureRes(req, res)([err?.message]);
    });
};
