import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        require: true,
        type: String,
        ref: "User"
    },
    items: [{
        product: {
            require: true,
            type: String,
            ref: "Product"
        },
        quantity: {
            require: true,
            type: Number,
            ref: "Product"
        }
    }
    ]})

    export default mongoose.model("Cart", cartSchema)