import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 3600 * 1000), // Default to 1 hour from now
    },
  },
  {
    timestamps: true, 
  }
);

export const Token = mongoose.model("Token", tokenSchema);
