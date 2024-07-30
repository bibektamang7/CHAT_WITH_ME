import jwt, { JwtPayload } from "jsonwebtoken";
import {Response, NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { User } from "../models/user.model";
interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
}

export const verifyJWT = asyncHandler(async (req: Request, res:Response, next:NextFunction) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
      if (!token) {
          throw new ApiError(401,"unauthorized request")
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        throw new ApiError(500, "Access token secret is not defined");
      }
  
      const decodedToken = jwt.verify(token,secret) as TokenPayload;
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      if (!user) {
          throw new ApiError(401, "Invalid access token");
      }
      req.user = user;
      next();
  } catch (error:any) {
      throw new ApiError(401,error?.message || "Invalid access token")
  }
})