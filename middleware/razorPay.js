const Razorpay = require('razorpay');
require("dotenv").config();

module.exports={

    instance : new Razorpay({
        key_id: process.env.RAZOR_KEY_ID,
        key_secret:process.env.KEY_SECRET,
      }),




}