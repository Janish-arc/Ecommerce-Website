import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingAddress : {
        address : {
            type : String,
            require : true
        },
        city : {
            require : true,
            type : String
        },
        state : {
            require : true,
            type : String
        },
        country : {
            require : true,
            type : String
        },
        pincode : {
            require : true,
            type : Number
        },
        phoneNo : {
            require : true,
            type : Number
        }
    },
    orderItems : [
        {
            name : {
                require : true,
                type : String
            },
            price : {
                require : true,
                type : Number
            },
            quantity : {
                require : true,
                type : Number
            },
            image : {
                require : true,
                type : String
            },
            product : {
                type : mongoose.Schema.ObjectId,
                require : true,
                ref : "Product"
            }
        },
    ],
    orderStatus : {
        required : true,
        type : String ,
        default : "Processing"
    },
    user : {
        require : true,
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    paymentInfo : {
        id : {
            required : true,
            type : String
        },
        status : {
            required : true,
            type : String
        },
        method : {
            required : true,
            type : String
        }
    },
    paidAt : {
        type : Date
    },
    itemPrice : {
        require : true,
        type : Number,
        default : 0
    },
    taxPrice : {
        require : true,
        type : Number,
        default : 0
    },
    shippingPrice : {
        require : true,
        type : Number,
        default : 0
    },
    totalPrice : {
        require : true,
        type : Number,
        default : 0
    },
    deliveredDate : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model("Order", orderSchema)