const mongoose = require("mongoose");
require('dotenv').config();
module.exports = {
  dbConnect: async () => {
    try {
      mongoose
        .connect(process.env.DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })

        .then((result) => {
          console.log("db connected");
        });
    } catch (error) {
      console.log(error);
    }
  },
};
