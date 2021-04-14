require("dotenv").config();

if (!process.env.PORT) {
  process.exit(1);
}

const env = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
};

const Role = {
  ADMIN: 1,
  BLOGGER: 2,
  VIEWER: 3,
};

module.exports = { env, Role };
