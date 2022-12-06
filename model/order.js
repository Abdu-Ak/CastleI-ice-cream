const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema (
    {
        userId :{
            type : ObjectId,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        mobileNumber : {
            type : Number,
        },
        orderItem : [
            {
                productId : {
                    type : ObjectId,
                    required : true
                },
                quantity : {
                    type : Number,
                    required : true
                },
            },
        ],
        totalAmount : { 
            type : Number,
            required : true
        },
        orderStatus : {
            type : String,
            required : true
        },
        paymentMethod: {
            type : String,
            required : true
        },
        orderdate :{
            type : String,
            required :true
    
        }
    },
    {timestamps : true},
);


const order = mongoose.model("orderDetails", orderSchema);
module.exports = order;