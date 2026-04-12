import handleError from '../helper/handleError.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'

export const verifyUser = async (req, res, next) => {
    try{
    const {token} = req.cookies
    console.log(token)
    const decodedData = jwt.verify(token, process.env.JWT_TOKEN)
    req.user = await User.findById(decodedData.id)
    console.log(req.user)
    next()
       } catch (error) {
        return next(new handleError("Please login to access", 401))
    }
}
export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new handleError("User not authenticated", 401))
        }
        if(!roles.includes(req.user.role)){
            return next(new handleError(`Role - ${req.user.role} is not allowed to access this page`))
        }
        next()
    }   
}
