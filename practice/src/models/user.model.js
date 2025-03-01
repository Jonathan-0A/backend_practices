import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    mobileNo: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        if (typeof this.password !== "string") {
            throw new Error("Password must be a string");
        }
        const saltRounds = 11;
        this.password = await bcrypt.hash(this.password, saltRounds);

        next(); 
    } catch (error) {
        next(error); 
    }
});

userSchema.methods.isPasswordMatch = async function (pass) {
    const isMatch = await bcrypt.compare(pass, this.password)
    return isMatch
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
         },
        proccess.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: proccess.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        proccess.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: proccess.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)