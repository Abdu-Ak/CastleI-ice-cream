const mongoose = require("mongoose");
const schema = mongoose.Schema;

const signupSchema = new schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    Status: {
      type: Boolean,
      default: true,
    },
   primaryaddress: {
      fullname: {
        type: String,
        
      },

      pincode: {
        type: Number,
      
      },
      locality: {
        type: String,
        
      },
      address: {
        type: String,
        
      },
      district: {
        type: String,
        
      },
      state: {
        type: String,
    
      },
      landmark: {
        type: String,
        
      },
    },
  },
  { timestamps: true }
);

const userdetails = mongoose.model("userDetails", signupSchema);
module.exports = userdetails;
