import handleError from "../helper/handleError.js"
import Order from "../models/orderModels.js"
import Product from "../models/productSchema.js"
import {v2 as cloudinary} from "cloudinary"

//New Order
export const newOrder = async (req, res, next) => {
    const {shippingAddress, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body
    const order = await Order.create({
        shippingAddress, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: paymentInfo.method === "COD" ? null : Date.now(), user : req.user._id
    })
    console.log(req.body)
    return res.status(201).json({success : true, order})
}

//Get Single Orders
export const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order) {
        return next(new handleError("Order not found", 404))
    }
    return res.status(200).json ({success : true, order})
}

//Get All Orders
export const getAllOrders = async (req, res, next) => {
    const {id} = req.params
    const order = await Order.find({user : id})
    const totalAmount = order.reduce((acc, ord) => acc + ord.totalPrice, 0)
    if(!order) {
        return next(new handleError("Order not found", 404))
    }
    return res.status(200).json({success : true, orders: order, count: order.length, totalAmount})
}

//Get All Orders by Admin
export const getAllOrdersByAdmin = async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email")
    if(!orders){
        return next(new handleError("Order not found", 404))
    }
    let totalAmount = 0
    orders.forEach((order) => totalAmount += order.totalPrice)
    return res.status(200).json({success : true, orders, totalAmount})
}

//Delete Orders By Admin
export const deleteOrders = async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order) {
        return next(new handleError("Order not found", 404))
    }
    if(order.orderStatus !== "Delivered"){
        return next(new handleError("Order is in progress cannot be deleted", 404))
    }
    await Order.deleteOne({_id: req.params.id})
    return res.status(200).json({ success : true, id:req.params.id, message : "Order deleted successfully"})
}

//Update Order Details
export const updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order) {
        return next (new handleError("Order not found", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new handleError("Order has been already delivered"), 404)
    }

    //Update Stock
    if (req.body.status === "Delivered") {
    await Promise.all(order.orderItems.map((item) =>
        updateQuantity(item.product, item.quantity)
    ));
    }
    order.orderStatus = req.body.status
    if(order.orderStatus === "Delivered"){
        order.deliveredDate = Date.now()
    }
    await order.save({validateBeforeSave : false})
    return res.status(200).json({success : true,order})
}

async function updateQuantity(id, quantity) {
    const product = await Product.findById(id)

     if (!id) {
        console.log("⚠️ Skipped item with no product ID")
        return
    }

    if (!product) {
        console.log("❌ Product not found:", id)
        return
    }
    product.stock -= quantity
    await product.save({validateBeforeSave : false})
}