
import { sendToken } from "../helper/jwt.js"
import { sendMail } from "../helper/sendEmail.js"
import User from "../models/userModels.js"
import Product from "../models/productSchema.js"
import Order from "../models/orderModels.js"
import crypto from 'crypto'
import {v2 as cloudinary} from "cloudinary"
import Apihelper from "../helper/Apihelper.js"
import handleError from "../helper/handleError.js" 


//User Registratiion
export const registerUser =async (req, res, next) => {
    const {name, email, password, avatar} = req.body

    if(!name){
        return next(new handleError("Name should not be empty", 400))
    }
    if(!email){
        return next(new handleError("Email id should not be empty", 400))
    }
    if(!password){
        return next(new handleError("Password should not be empty", 400))
    }
    const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "ECOM_AVATAR",
        width: 150, 
        crop: "scale"
    })
    const user = await User.create({
        name, email, password, 
        avatar: { public_id: myCloud.public_id, url: myCloud.secure_url }
    })
   sendToken(user, 201, res)
}

//User Login
export const loginUser = async(req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        return next( new handleError("Email or password cannot be empty", 400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new handleError("Email id or password is incorrect", 404))
    }
    const isValidPassword = await user.verifyPassword(password)
    if(!isValidPassword){
        return next(new handleError("Invalid email id or Password", 400))
    }
    
    sendToken(user, 200, res)
}

//User Logout
export const logoutUser = (req, res, next) => {
    const options = {expires: new Date(Date.now()), httpOnly: true}
    res.cookie("token", null, options)
    return res.status(201).send({success:true, message:"Logged out successfully"})
}

//Forgot Password 
/*
export const forgotPassword = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        return next(new handleError("User is not found", 404))
    }
    
    let resetToken;
    try{
        resetToken = user.resetUserPassword()
        await user.save()
        console.log(resetToken)
    }catch(err){
        return next(new handleError("Cannot generate rest token, please try again later", 404))
    }
    const resetPasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`
    const message = `Please click on the below link to reset your password \n${resetPasswordUrl} \nThis link will expire in 30 minutes \nIf this is not you please ignore this message`
    try {
        await sendMail({email: user.email, subject: "Reset your password", message})
        res.status(200).json({message: `Request has been sent to ${user.email} email`})
    } catch (error) {
        user.resetPasswordToken = undefined,
        user.resetPasswordExpiry = undefined,
        await user.save()
        return next(new handleError("Link cannot be send to your email, please try again later..", 404))
    }
    console.log(resetPasswordUrl)
    console.log(message)
}
*/

//Forgot Password using HTML 
export const forgotPassword = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        return next(new handleError("User is not found", 404))
    }
    
    let resetToken;
    try{
        resetToken = user.resetUserPassword()
        await user.save()
        console.log(resetToken)
    }catch(err){
        return next(new handleError("Cannot generate rest token, please try again later", 404))
    }
    // const resetPasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`
    const resetPasswordUrl = `http://localhost:5173/reset/password/${resetToken}`
    const message = `Please click on the below link to reset your password \n${resetPasswordUrl} \nThis link will expire in 30 minutes \nIf this is not you please ignore this message`
   const messageHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>
            You requested to reset your password. Click the button below to continue:
            </p>
            <div style="text-align: center; margin: 20px 0;">
            <a href="${resetPasswordUrl}"
                style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
            </div>
            <p>
            Or copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #007bff;">
            ${resetPasswordUrl}
            </p>
            <p style="color: red; font-weight: bold;">
            This link will expire in 30 minutes.
            </p>
            <p>
            If you did not request a password reset, please ignore this email.
            </p>
            <br>
            <p>
            Regards,<br>
            Your Website Team
            </p>
        </div>
        </div>
        `;
    try {
        await sendMail({email: user.email, subject: "Reset your password", message, htmlMessage:messageHtml})
        res.status(200).json({message: `Request has been sent to ${user.email} email`})
    } catch (error) {
        user.resetPasswordToken = undefined,
        user.resetPasswordExpiry = undefined,
        await user.save({validateBeforeSave: false})
        return next(new handleError("Link cannot be send to your email, please try again later..", 404))
    }
    console.log(resetPasswordUrl)
    console.log(message)
}

//Reset Password
export const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken, resetPasswordExpiry: {$gt: Date.now()}
    })
    if(!user){
        return next(new handleError("Invalid user or user code has been expired", 404))
    }
    const {password, confirmPassword} = req.body
    if(password !== confirmPassword){
        return next(new handleError("Password doesn't match please check both the password", 404))
    }
    user.password = password,
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()
    sendToken(user, 201, res)
}

//Get User Profile
export const profile = async (req, res, next) => {
    if(!req.user){
        return 
    }
    const user = await User.findById(req.user.id)
    return res.status(200).json({
        success: true, user
    })
}

//Update User Password
export const updatePassword = async (req, res, next) => {
    const {Password, newPassword, confirmPassword} = req.body
    const user = await User.findById(req.user.id).select("+password")
    const isCorrect = await user.verifyPassword(Password)
    if(!isCorrect){
        return next(new handleError("Password is incorrect"), 400)
    }
    if(newPassword !== confirmPassword){
        return next(new handleError("Confirm password and new password is not matched"))
    }
    user.password = newPassword
    await user.save()
   
    return res.status(201).json("Password has been changed successfully")
     sendToken(user, 201, res)
}

//Update User Profile
export const updateProfile = async (req, res, next) => {
    const {name, email, avatar} = req.body
    const updatedUserDetails = {name, email}
     const user = await User.findById(req.user.id)
    if(avatar){
         if(user.avatar?.public_id){
            await cloudinary.uploader.destroy(user.avatar.public_id)
        }

        const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "ECOM_AVATAR",
        width: 150,
        crop: "scale",
        quality: "auto"
    })
    updatedUserDetails.avatar = {
        public_id: myCloud.public_id,
        url : myCloud.secure_url
    }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedUserDetails, {new: true, runValidators: true})
    res.status(200).json({success: true, message:"Profile updated successfully", updatedUser})
}

//Get all users => Admin
export const getAllUsers = async (req, res, next) => {
  const UsersPerPage = 10
  const apihelper = new Apihelper(User.find(), req.query).search().filter()
  const filteredQuery = apihelper.query.clone()
  const userCount = await filteredQuery.countDocuments()
  const page = Number(req.query.page) || 1
  const totalPages = Math.ceil(userCount / UsersPerPage)
  if (totalPages > 0 && page > totalPages) {
    return next(new handleError("This page doesn't exist", 404))
  }
  apihelper.pagination(UsersPerPage)
  const Users = await apihelper.query
  return res.status(200).json({
    success: true,
    Users,
    userCount,
    totalPages,
    UsersPerPage,
    currentPage: page
  })

}

//Get single user => Admin
export const getSingleUser = async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)
    if(!user){
        return next(new handleError("User is not exist", 404))
    }
    return res.json ({success: true, user})
}

//Update role
export const updateRole = async (req, res, next) => {
    const {role} = req.body 
    const id = req.params.id
    const updatedRole = {role}
    const user = await User.findByIdAndUpdate(id, updatedRole, {new: true})
    if(!user){
        return next(new handleError("User is not found", 404))
    }
    return res.json({success : true, user})
}

//Delete user
export const deleteUser = async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)
    if(!user){
        return next(new handleError("User is not found", 404))
    }
    await User.findByIdAndDelete(id)
    return res.json({success : true, message: "User details deleted successfully"})
}

//Admin Dashboard
export const adminDashboard = async(req, res, next) => {
    const productCount = await Product.countDocuments()
    const userCount = await User.countDocuments()
    const orderCount = await Order.countDocuments()
    return res.status(200).json({success: true, userCount, productCount, orderCount})
}
