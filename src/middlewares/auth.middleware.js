import jwt from "jsonwebtoken";
import catchAsync from '../utils/catchAsync.js';
import { secretKey } from "../controllers/user.controller.js"
import { ApiErrors } from "../utils/apiError.js"
import pool from "../db/db.js";



export const verifyAuth = catchAsync(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiErrors(400, "Token is missing");
    }
    try {
      const decodeToken = await jwt.verify(token, secretKey);
      console.log(decodeToken);
  
      const result = await pool.query(`SELECT * FROM student WHERE email = $1`, [decodeToken.email]);
      const user = result.rows[0];
      console.log(user);
  
      if (!user) {
        throw new ApiErrors(401, "Invalid Access Token");
      }
  
      req.user = user;
  
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      throw new ApiErrors(401, "Invalid Access Token");
    }
  
    next();
  });

export const verifyInstructor = catchAsync(async(req, res, next)=>{

    if(req.user.role != "applicator" && req.user.role != "instructor"){
        throw new ApiErrors(401, "this route is protected for in structor's only");
    }
    next();
});

export const verifyAdmin = catchAsync(async(req, res, next)=>{
    if(req.user.role != "admin" && req.user.role != "instructor"){
        throw new ApiErrors(401, "this route is protected for admin only");
    }
    next();
});