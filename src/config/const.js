require("dotenv").config();

if (!process.env.PORT) {
  process.exit(1);
}

export const LIMIT_SIZE = 1024 * 1024;

export const env = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  WEMAP_API_KEY: process.env.WEMAP_API_KEY,
};

export const Role = {
  COMMON_USER: 1,
  SELLER: 2,
  ADMIN: 3,
};

export const HouseStatus = {
  PENDING: 1,
  REJECTED: 2,
  SELLING: 3,
  SOLD: 4,
};
