require("dotenv").config();

if (!process.env.PORT) {
  process.exit(1);
}

exports.LIMIT_SIZE = 1024 * 1024;
exports.PAGE = 1;
exports.PER_PAGE = 2;

exports.Role = {
  COMMON_USER: "1",
  SELLER: "2",
  ADMIN: "3",
};

exports.HouseStatus = {
  PENDING: 1,
  REJECTED: 2,
  SELLING: 3,
  SOLD: 4,
};
