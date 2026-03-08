import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔥 ONLY REAL LOCATION — NO DEFAULT
export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    console.log("📍 Received location update:", { lat, lon });

    if (
      lat === undefined ||
      lon === undefined ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [Number(lon), Number(lat)], // [lng, lat]
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Location updated:", user.location.coordinates);

    return res.json({
      success: true,
      location: user.location,
    });
  } catch (error) {
    console.error("❌ updateUserLocation error:", error);
    return res.status(500).json({ message: "Location update failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;
    const { fullname, email, mobile } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    // Return updated user (without password)
    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (error) {
    console.error("❌ Update profile error:", error);
    return res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};