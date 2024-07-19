import jwt from "jsonwebtoken";
import { NextFunction, Request } from "express";
import { asyncHandler } from "src/utils/asyncHandler";
import ApiError from "src/utils/apiError";
import { User } from "src/models/user.model";

export const verifyJWT = asyncHandler(async (req: Request, _, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(500, "Access token secret is not defined");
    }

      const decodedToken = jwt.verify(token, secret);
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      req.user = user;
      next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
