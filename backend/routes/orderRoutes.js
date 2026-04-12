import express from "express"
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js"
import { deleteOrders, getAllOrders, getAllOrdersByAdmin, getSingleOrder, newOrder, updateOrder } from "../controller/orderController.js"

const order = express.Router()

order.route("/new/order").post(verifyUser, newOrder)
order.route("/order/:id").get(verifyUser, getSingleOrder)
order.route("/orders/user/:id").get(verifyUser, getAllOrders)
order.route("/admin/orders").get(verifyUser, roleBasedAccess("admin"), getAllOrdersByAdmin)
order.route("/admin/order/:id").delete(verifyUser, roleBasedAccess("admin"), deleteOrders).put(verifyUser, roleBasedAccess("admin"), updateOrder)

export default order