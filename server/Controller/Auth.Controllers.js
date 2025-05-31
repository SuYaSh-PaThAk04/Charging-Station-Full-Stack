import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandller.js";
import { User } from "../Models/Users.Models.js";
import bcrypt from "bcryptjs"


const GenrateAcessAndRefreshToken= async (userid)=>{
   try {
     const user = await User.findById(userid);
     const accessToken = user.GenerateAccessToken();
     const refreshToken = user.GenerateRefreshToken();
     user.refreshToken=refreshToken;
     await  user.save({validateBeforeSave:false})
     return {accessToken,refreshToken}
   } catch (error) {
    throw new ApiError(401,`Error while generating tokens ${error.message}`)
   }
}


const options={
    httpOnly : true,
    secure : true
}
const signUpUser= asyncHandler(async(req,res)=>{

    const{username,email,password}= req.body;
    if(!username || !email || !password){
        throw new ApiError(400,"All feilds are required");
    }
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(400,"User already existed")
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password,salt);
    
    const newUser = await User.create({
        username,
        email,
        password : hashPassword
    })
    const user = await User.findById(newUser._id).select("-password -refreshToken" )

    return res.status(200)
    .json(
        new ApiResponse(201,user,"User registered successfully!!")
    )
})

const loginUser = asyncHandler(async (req,res)=>{
      const {email,password,username} = req.body;
    if(!username && !email){
        throw new ApiError(410,"all feilds are required")
    }
    const user = await User.findOne({
        $or : [{email},{username}]
    })
    const validatePassword = await user.IsPasswordCorrect(password);
    if(!validatePassword){
        throw new ApiError(400,"Invalid password")
    }
     const {refreshToken,accessToken}=await GenrateAcessAndRefreshToken(user._id)
    const LogedinUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(201,
           {
             user:LogedinUser,accessToken,refreshToken}
             ,"User Login successfull !!")
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
       { 
        $set:{
            refreshToken: undefined
        }
       },
       {
        new: true
       }
    )
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(201,"User logedOut succesfull !!")
  )
})
const RefreshAccessToken = asyncHandler(async (req,res)=>{
    const IncomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!IncomingToken){
     throw new ApiError(401,"Invalid Authorization")
    }
     try {
        const decoder = jwt.verify(IncomingToken,process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decoder?._id)
        if(!user){
            throw ApiError(401,"Invalid refresh token")
        }
      if(IncomingToken != user?.refreshToken) {
        throw new ApiError(401,"Refresh Token is expired o used")
      }
     const options= {
        httpOnly: true,
        secure : true,
     }
     const {accessToken,newRefreshToken}= await GenerateAccessToken(user._id)
     return res.status(201).cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
        new ApiResponse(200,{accessToken,refreshToken : newRefreshToken},
            "Access tokens Refreshed"
        )
     )
     } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh tokens")
     }
    })
    const getCurrentUser = asyncHandler(async(req,res)=>{
        return res
        .status(200)
        .json(
           new ApiResponse( 200,req.user,"Current user fetched successfully")
        )
    })
    const changeCurrentPaasword = asyncHandler(async(req,res)=>{
        const{newPassword, oldPassword , confirmPassword}= req.body;
        if(newPassword !== confirmPassword){
            throw new ApiError(400,"New password and Confirm password should match")
        }
        const user = await User.findById(req.user?._id)
        const validatePassword = await user.IsPasswordCorrect(oldPassword)
        if(!validatePassword){
            throw new ApiError(401,"Invalid old password")  
        }
        user.password = newPassword;
     await user.save({validateBeforeSave : false})
     return res.status(201)
     .json(
      new ApiResponse(201,{},"Password updated successfully")
     )
    })
    const updateAccountDetails = asyncHandler(async(req,res)=>{
    
        const {username,email}= req.body
    
        if(!email || !username){
            throw new ApiError(401,"All feilds are required")
        }
        const user = await User.findOneAndUpdate(req.user?._id,
            {
                $set:{
                    email :email,
                    username : username
                }
            },{
                new : true
            }
        ).select("-password")
    
        return res
        .status(200)
        .json(
            new ApiResponse(201,user,"Account details updated successfully!!")
        )
    })


    export {
        signUpUser,
        loginUser,
        logoutUser,
        RefreshAccessToken,
        getCurrentUser,
        changeCurrentPaasword,
        updateAccountDetails
    }