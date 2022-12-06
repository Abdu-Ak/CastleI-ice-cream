const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema(

    {
        Category: {
            type: String,
            require: true,
            unique : true
          },
    },
    { timestamps: true }
)

const category = mongoose.model('categoryDetails',categorySchema)
module.exports = category ;