import { asyncHandler } from "../utils/asyncHandller.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username) {
        return res.status(400).json(
            new ApiResponse(400, "Username is required!")
        );
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
        return res.status(409).json(
            new ApiResponse(409, "User with this username already exists!")
        );
    }
    return res.status(200).json(
        new ApiResponse(200, true, "Username is available")
    );
})