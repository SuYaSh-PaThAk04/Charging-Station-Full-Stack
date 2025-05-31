import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({

    username:{
        type : String,
        required: true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required:true
    },
    refreshToken:{
        type : String,
    }
})


userSchema.methods.IsPasswordCorrect = async function(password){
return  await bcrypt.compare(password,this.password)
}


userSchema.methods.GenerateAccessToken= function () {
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.GenerateRefreshToken= function () {
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User",userSchema);