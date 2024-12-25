import { asyncHandler } from "../utils/asyncHandller.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, mobileNo } = req.body;
    if ([name, username, email, password, mobileNo].some(e => !e?.trim())) {
        return res.status(400).json(
            new ApiResponse(400, "All fields are required!")
        );
    }
    const userExist = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
    if (userExist) {
        return res.status(400).json(
            new ApiResponse(400, "User with this email or username already exists!")
        );
    }
    let avatarImage = "";
    let coverImage = "";
    if (req.files?.avatarImage?.[0]?.path) {
        try {
            const avatarImgPath = req.files.avatarImage[0].path;
            avatarImage = await uploadOnCloudinary(avatarImgPath) || "";
        } catch (err) {
            console.log("Error to upload: ", err);
            throw new ApiError(500, "Failed to upload avatar image!", err);
        }
    }
    if (req.files?.coverImage?.[0]?.path) {
        try {
            const coverImgPath = req.files.coverImage[0].path;
            coverImage = await uploadOnCloudinary(coverImgPath) || "";
        } catch (err) {
            console.log("Error to upload: ", err);  
            throw new ApiError(500, "Failed to upload avatar image!", err);            
        }
    }
    const user = await User.create({
        name,
        username: username.toLowerCase(),
        email,
        password,
        mobileNo,
        avatarImage,
        coverImage,
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Failed to register this user!");
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    
})
