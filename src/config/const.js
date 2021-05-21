require("dotenv").config();

if (!process.env.PORT) {
  process.exit(1);
}

exports.LIMIT_SIZE = 1024 * 1024;

exports.env = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  WEMAP_API_KEY: process.env.WEMAP_API_KEY,
};

exports.Role = {
  COMMON_USER: 1,
  SELLER: 2,
  ADMIN: 3,
};

exports.HouseStatus = {
  PENDING: 1,
  REJECTED: 2,
  SELLING: 3,
  SOLD: 4,
};
