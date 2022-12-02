const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema(
  {
    productName: {
      type: String,
      require: true,
    },
    Category: {
      type: String,
      require: true,
    },
    details: {
      type: String,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const productdetails = mongoose.model("productDetails", productSchema);
module.exports = productdetails;
