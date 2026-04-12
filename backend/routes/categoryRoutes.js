import express from 'express'
import { roleBasedAccess, verifyUser } from '../helper/userAuth.js'
import { createCategory, deleteCategory, editCategory, getCategory } from '../controller/categoryController.js'

const category = express.Router()

category.route("/add/category").post(verifyUser, roleBasedAccess("admin"), createCategory)
category.route("/get/category").get(verifyUser, getCategory)
category.route("/delete/category/:id").delete(verifyUser, roleBasedAccess("admin"), deleteCategory)
category.route("/edit/category/:id").put(verifyUser, roleBasedAccess("admin"), editCategory)
export default category