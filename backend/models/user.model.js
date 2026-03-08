import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    mobile: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },
    // ✅ Ab ye fields role ke niche flat level par dikhengi
    socketId: {
      type: String,
      required: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    resetOtp: String,
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: Date,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;