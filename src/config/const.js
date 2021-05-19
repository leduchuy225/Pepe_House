require("dotenv").config();

if (!process.env.PORT) {
  process.exit(1);
}

const LIMIT_SIZE = 1024 * 1024;

const env = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  WEMAP_API_KEY: process.env.WEMAP_API_KEY,
};

const Role = {
  COMMON_USER: 1,
  BLOGGER: 2,
  ADMIN: 3,
};

const Type = {
  DESTINATION: 1,
  JOURNEY: 2,
  CITY: 3,
};

const HouseType = {
  HOTEL: 1,
  RESTAURANT: 2,
  SIGHTSEEING: 3,
  PARK: 4,
};

const JourneyType = {};

module.exports = { env, Role, Type, HouseType, LIMIT_SIZE };
