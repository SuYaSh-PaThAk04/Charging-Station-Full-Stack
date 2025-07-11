import express from "express"
import  VerifyJWT  from "../Middlewares/verifyJWT.middleware.js"
import { changeCurrentPaasword, loginUser, signUpUser, updateAccountDetails,logoutUser } from "../Controller/Auth.Controllers.js"


const router = express.Router()

router.route('/signUp').post(signUpUser);

router.route('/login').post(loginUser);
router.route('/logout').post(VerifyJWT,logoutUser)
router.route('/chnagePass').post(changeCurrentPaasword)
router.route('/UpdateDetails').post(updateAccountDetails)
export {router}
