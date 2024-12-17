import { asyncHandler } from "../utils/asyncHandller.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, mobileNo } = req.body;
    if ([name, username, email, password, mobileNo].some(e => !e?.trim())) {
        return res.status(400).json(
            new ApiResponse(400, "All fields are required!")
        );
    }
    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
        return res.status(400).json(
            new ApiResponse(400, "User with this email or username already exists!")
        );
    }
    let avatarImage = "";
    let coverImage = "";
    if (req.files?.avatarImage?.[0]?.path) {
        const avatarPath = req.files.avatarImage[0].path;
        avatarImage = await upload(avatarPath) || "";
    }
    if (req.files?.coverImage?.[0]?.path) {
        const coverImgPath = req.files.coverImage[0].path;
        coverImage = await upload(coverImgPath) || "";
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
        return res.status(500).json(
            new ApiResponse(500, "Failed to register this user!")
        );
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "ok"
    })
})
