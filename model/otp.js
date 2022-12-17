const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const otpSchema = new Schema({
  otp: {
    type: Number,
    required: true,
  },
});

const otp = mongoose.model("otp", otpSchema);
module.exports = otp;