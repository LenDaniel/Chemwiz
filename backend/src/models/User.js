const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    level: {
      type: String,
      default: "A-Level Chemistry",
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "premium", "teacher", "admin"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trial", "expired", "cancelled"],
      default: "active",
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    trialStartedAt: {
      type: Date,
      default: Date.now,
    },
    tutorUsage: {
      day: { type: String, default: '' },
      count: { type: Number, default: 0 },
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
