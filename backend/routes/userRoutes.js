    import express from 'express'
import { roleBasedAccess, verifyUser } from '../helper/userAuth.js';
import { loginUser, logoutUser, registerUser, forgotPassword, resetPassword, profile, updatePassword, updateProfile, getAllUsers, getSingleUser, updateRole, deleteUser, adminDashboard } from "../controller/userController.js";

const user = express.Router()

user.route('/register').post(registerUser)
user.route('/login').post(loginUser)
user.route('/logout').get(logoutUser)
user.route('/password/forgot').post(forgotPassword)
user.route('/reset/:token').post(resetPassword)
user.route('/profile').get(verifyUser, profile)
user.route('/password/update').put(verifyUser, updatePassword)
user.route('/profile/update').put(verifyUser, updateProfile)

user.route('/admin/users').get(verifyUser, roleBasedAccess("admin"), getAllUsers)
user.route('/admin/user/:id').get(verifyUser, roleBasedAccess("admin"), getSingleUser)
user.route('/admin/user/role/:id').put(verifyUser, roleBasedAccess("admin"), updateRole)
user.route('/admin/user/delete/:id').delete(verifyUser, roleBasedAccess("admin"), deleteUser)
user.route('/admin/dashboard').get(verifyUser, roleBasedAccess("admin"), adminDashboard)
export default user