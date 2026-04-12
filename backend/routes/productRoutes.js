import express from 'express'
import { addProducts, updateProduct, getAllProducts, getSelectedProduct, deleteProduct, productReview, viewReview, deleteReview, getLatestProducts, getProductsByAdmin } from '../controller/productController.js'
import { verifyUser, roleBasedAccess } from '../helper/userAuth.js'


const router = express.Router()

router.route("/products").get(getAllProducts )
router.route("/latest/products").get(getLatestProducts)
router.route("/product/:id").get(verifyUser, getSelectedProduct)
router.route("/admin/products").get(verifyUser, roleBasedAccess("admin"),getProductsByAdmin )
router.route("/products/add").post(verifyUser, roleBasedAccess("admin"), addProducts)
router.route("/admin/product/:id"). put(verifyUser, roleBasedAccess("admin"),updateProduct).delete(verifyUser, roleBasedAccess("admin"),deleteProduct)
router.route("/review").put(verifyUser, productReview)
router.route("/admin/review").get(verifyUser, viewReview)
router.route("/admin/review/delete/:id").delete(verifyUser, roleBasedAccess("admin"), deleteReview)

export default router