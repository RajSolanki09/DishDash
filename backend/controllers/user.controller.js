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
        isOnline: true, // ✅ FIX: Mark user as online when location is updated
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

export const toggleFavorite = async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(itemId);
    if (index === -1) {
      user.favorites.push(itemId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();

    // ✅ Return populated favorites with full item + shop data
    const populatedUser = await User.findById(req.userId).populate({
      path: "favorites",
      populate: { path: "shop", select: "name image city" }
    });

    res.status(200).json({ success: true, favorites: populatedUser.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "favorites",
      populate: { path: "shop", select: "name image city" }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const toggleDutyStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDutyOn = !user.isDutyOn;
    await user.save();

    res.status(200).json({ success: true, isDutyOn: user.isDutyOn });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle duty status" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};