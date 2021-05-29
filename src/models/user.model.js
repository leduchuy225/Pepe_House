const { Schema, model } = require("mongoose");
const { Role } = require("../config/const");

const options = { discriminatorKey: "role" };

const BaseUserSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: Role.COMMON_USER,
    },
    phone: {
      type: String,
    },
    avatar: String,
  },
  options
);

const SellerSchema = new Schema({});
const AdminSchema = new Schema({});

const BaseUser = model("BaseUser", BaseUserSchema);
const Seller = BaseUser.discriminator("Seller", SellerSchema, Role.SELLER);
const Admin = BaseUser.discriminator("Admin", AdminSchema, Role.ADMIN);

module.exports = { BaseUser, Seller, Admin };
