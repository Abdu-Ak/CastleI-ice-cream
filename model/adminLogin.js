const mongoose = require("mongoose");
const schema = mongoose.Schema;
const adminLoginSchema = new schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const admindetails = mongoose.model("adminDetails", adminLoginSchema);
module.exports = admindetails;
