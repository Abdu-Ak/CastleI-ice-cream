const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const favoriteSchema = new Schema({
  userId: {
    type:String,
    required: true,
  },
  product: [
    {
        productId:{
            type:ObjectId,
            required:true
        },
        
    }
  ],
});

const favorite = mongoose.model('favorite',favoriteSchema);
module.exports = favorite;