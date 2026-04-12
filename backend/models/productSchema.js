import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    MRP: {
        type: Number,
    },
    image:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Category"   
    },
    detailedDescription: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        required: [true, "Please enter product Stock"],
        default: 1
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user : {type: mongoose.Schema.ObjectId, ref: "User", require: true},
            name: {type: String, require: true},
            avatar: {type: String},
            rating: {type: Number, require: true},
            comment: {type: String, require: true},
            createdAt: {type: Date, default: Date.now()}
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Product", productSchema)