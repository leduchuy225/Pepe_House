const { Schema, model } = require("mongoose");
const { Role } = require("../config/const");

const BaseUserSchema = new Schema({
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
  avatar: String,
});

const BloggerSchema = new Schema({
  role: { type: String, default: Role.BLOGGER },
});
const AdminSchema = new Schema({
  role: { type: String, default: Role.ADMIN },
});

const BaseUser = model("BaseUser", BaseUserSchema);
const Blogger = BaseUser.discriminator("Blogger", BloggerSchema);
const Admin = BaseUser.discriminator("Admin", AdminSchema);

module.exports = { BaseUser, Blogger, Admin };
