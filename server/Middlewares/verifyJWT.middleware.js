import jwt from "jsonwebtoken";
import {ApiError} from '../Utils/ApiError.js'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  
  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    throw new ApiError(401, "Invalid access token");
  }
};

export default verifyToken;

