const mongoose = require("mongoose");
const { Schema } = mongoose;
const Adminlogin = new Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", Adminlogin);
