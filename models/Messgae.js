const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = new Schema(
  {
    country: { type: String },
    rafferid: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", Message);