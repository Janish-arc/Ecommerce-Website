import mongoose from "mongoose";
import validator from 'validator'
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from 'crypto';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter username"],
        maxLength: [25, "Please enter name with fewer than 25 characters"]
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validator: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        require: true,
        select: false,
        maxLength: [8, "Password must be atleast 8 characters"]
    },
    avatar:{
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    },
    role:{
        type: String,
        default: "user"
    },     
    resetPasswordToken : String,
    resetPasswordExpiry: Date
},
{timestamps: true}
);
userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
userSchema.methods.verifyPassword = async function (userPassword) {
    return await bcryptjs.compare(userPassword, this.password)
}
userSchema.methods.resetUserPassword = function(){
    const resetToken= crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpiry = Date.now() + 30 * 60 * 1000
    return resetToken;
}

export default mongoose.model("User", userSchema)