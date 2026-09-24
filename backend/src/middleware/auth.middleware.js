import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {

  try{

    const token = req.cookies.jwt;
  
    if(!token){
      return res.status(401).json({message:"Unauthorized access: Token not provided"});
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    if(!decoded){
      return res.status(401).json({message:"Unauthorized access: Invalid Token"});
    }
  
    const user = await User.findById(decoded.userId).select("-password"); // remove the password field from the userData(not actually)
  
    if(!user){
      return res.status(401).json({message:"Unauthorized access: User not found"});
    }
    
    req.user = user;  // we store the user in the req so that it is accessible to "onboard"
  
    next();
  }
  catch(error){
    console.error("Error in protectRoute middleware", error);
    return res.status(500).json({message:"Internal server error"});
  }
}