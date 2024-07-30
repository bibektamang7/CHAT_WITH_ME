import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { IUser, User } from "../models/user.model";
import { Request, Response } from "express";
import { UserRolesEnum } from "../constants";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId: mongoose.ObjectId) => {
  try {
    const user = (await User.findById(userId)) as IUser;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    throw new ApiError(404, "user does not exist");
  }
  const user = (await User.findOne({ username })) as IUser;

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // get the user document ignoring the password and refreshToken field
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  // TODO: Add more options to make cookie more secure and reliable
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
    );
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };
    
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username, role } = req.body;
  console.log(req.body);
  
  console.log(email, password);
  if (!(email && password)) {
    throw new ApiError(401, "All field required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exixts", []);
  }
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
    role: role || UserRolesEnum.USER,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "Users registered successfully and verification email has been sent on your email"
      )
    );
});

export { login, registerUser, logout };
