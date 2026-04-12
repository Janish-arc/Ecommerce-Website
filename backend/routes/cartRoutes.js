import express from "express"
import { addToCart, getCart, removeCartProduct } from "../controller/cartController.js"
import { verifyUser } from "../helper/userAuth.js"

const cart = express.Router()

cart.route("/cart/addProduct").post(verifyUser, addToCart)
cart.route("/cart").get(verifyUser, getCart)
cart.route("/cart/removeProducts/:productId").delete(verifyUser, removeCartProduct)

export default cart 
