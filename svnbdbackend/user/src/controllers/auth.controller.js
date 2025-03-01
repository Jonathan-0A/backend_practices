import User from '../models/user.model.js';
import { asyncHandler } from "../../src/utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const register = asyncHandler(async (req, res) => {
    try {
        const { email, password, name, username } = req.body;
        if ([email, password, name].some(e => !e?.trim())) {
            return res.status(400).json({
                message: "All fields are required!",
                data: {}
            });
        }
        const userExist = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
        if (userExist) {
            return res.status(400).json({
                message: "User with this email or username already exists!",
                data: {}
            });
        }
        const user = await User.create({ email, password, name, username: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: "Failed to register this user!",
                data: {}
            });
        }
        const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");
        if (!createdUser) {
            return res.status(400).json({
                message: "Failed to register this user!",
                data: {}
            });
        }

        return res.status(201).json({
            message: "User created successfully",
            data: user
        });
    } catch (err) {
        console.error("Error to register new user: ", err);
        res.status(500).json({
            message: "Internal Server Error",
            data: err
        });
    }
});
export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if ([email, password].some(e => !e?.trim())) {
            return res.status(400).json({
                message: "All fields are required!",
                data: {}
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not found in database!",
                data: {}
            });
        }
        const isMatch = await user.isMatchPass(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password!",
                data: {}
            });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: "User logged in successfully",
            data: {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
    } catch (err) {
        console.error("Error to log in user: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
            data: err
        });
    }
});
export const logout = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        if (!email?.trim()) {
            return res.status(400).json({
                message: "Email is required!",
                data: {}
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not found in database!",
                data: {}
            });
        }
        // Invalidate the refresh token by removing it from the user document
        user.refreshToken = null;
        await user.save();

        return res.status(200).json({
            message: "User logged out successfully",
            data: {}
        });
    } catch (err) {
        console.error("Error to log out user: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
            data: err
        });
    }
});