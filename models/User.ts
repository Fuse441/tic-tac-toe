import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  score: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },
});

export const User = models.User || model("User", UserSchema);
