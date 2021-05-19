const House = require("../models/house.model");
const Journey = require("../models/journey.model");
const City = require("../models/city.model");
const { Type } = require("../config/const");
const { successRes } = require("../config/response");

const LIMIT_DEFAULT = 3;

module.exports.search = async (req, res) => {
  const { keyword, type } = req.query;
  const regex = new RegExp(keyword, "i");

  let houses, journeys, cities;

  type == Type.DESTINATION || !type ? (houses = await findHouses(regex)) : null;
  type == Type.JOURNEY || !type ? (journeys = await findJourneys(regex)) : null;
  type == Type.CITY || !type ? (cities = await findCities(regex)) : null;

  return successRes(req, res)({ houses, journeys, cities });
};

const findHouses = async (regex, limit) => {
  return await House.find({
    name: { $regex: regex },
  }).limit(limit || LIMIT_DEFAULT);
};

const findJourneys = async (regex, limit) => {
  return await Journey.find({
    name: { $regex: regex },
  }).limit(limit || LIMIT_DEFAULT);
};

const findCities = async (regex, limit) => {
  return await City.find({
    name: { $regex: regex },
  }).limit(limit || LIMIT_DEFAULT);
};
