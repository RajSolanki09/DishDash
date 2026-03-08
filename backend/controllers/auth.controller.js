import bcrypt from "bcrypt";
import genToken from "../utils/token.js";
import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullname, email, password, mobile, role, lat, lon } = req.body;

    // Check if location is coming from frontend
    if (lat === undefined || lon === undefined) {
      return res.status(400).json({ message: "Current location is required to register." });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      role,
      mobile,
      password: hashedPassword,
      // MongoDB GeoJSON format
      location: {
        type: "Point",
        coordinates: [Number(lon), Number(lat)], // Always [Longitude, Latitude]
      },
    });

    const token = await genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    console.log('📧 Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(user._id);
    
    console.log('✅ Token generated for:', email);
    console.log('🍪 Setting cookie...');

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log('✅ Login successful for:', email);
    return res.status(200).json({ message: `Welcome back ${user.fullname}`, user });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    return res.status(500).json(`sign out failed ${error}`);
  }
};

export const sendOtp = async (req, res) => {
  try {
    console.log("📧 Send OTP request received for:", req.body.email);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "User does not exist" });
    }

    console.log("✅ User found, generating OTP...");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    console.log("📨 Sending email to:", email);
    await sendOtpMail(email, otp);

    console.log("✅ OTP sent successfully");
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Send OTP failed",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid/Expired OTP.." });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json(`verify otp failed ${error}`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res
        .status(400)
        .json({ message: "User does not exist or OTP not verified.." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json(`reset password failed ${error}`);
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { fullname, email, mobile, role, lat, lon } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      if (!mobile || !role || lat === undefined || lon === undefined) {
        return res.status(400).json({ 
          message: "Location, Mobile and Role are required for new Google account." 
        });
      }

      user = await User.create({ 
        fullname, 
        email, 
        mobile, 
        role,
        location: {
          type: "Point",
          coordinates: [Number(lon), Number(lat)] // 👈 GeoJSON format
        }
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Success", user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ message: "Google auth failed" });
  }
};