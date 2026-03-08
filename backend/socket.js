import User from "./models/user.model.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // 🔥 Handle user identity
    socket.on("identity", async (data) => {
      try {
        const { userID } = data;
        if (!userID) return;

        // Update user with socket info
        await User.findByIdAndUpdate(userID, {
          $set: {
            socketId: socket.id,
            isOnline: true,
          },
        });

        console.log(`🟢 User Online: ${userID} - Socket: ${socket.id}`);
      } catch (error) {
        console.error("❌ Socket Identity Error:", error);
      }
    });

    // 🔥 HANDLE REAL-TIME LOCATION UPDATE
    socket.on("updateLocation", async (data) => {
      try {
        const { userId, latitude, longitude } = data;

        if (!userId || !latitude || !longitude) {
          console.error("❌ Invalid location data:", data);
          return;
        }

        // Update user location in database
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              location: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              isOnline: true,
              socketId: socket.id,
            }
          },
          { new: true }
        );

        if (user) {
          // 🔥 BROADCAST location to ALL connected clients (for TrackOrderPage)
          io.emit('updateDeliveryLocation', {
            deliveryBoyId: userId,
            latitude,
            longitude
          });

          console.log(`📍 Location updated for ${user.fullname}: ${latitude}, ${longitude}`);
        } else {
          console.error("❌ User not found:", userId);
        }

      } catch (error) {
        console.error("❌ Update location error:", error);
      }
    });

    // 🔥 Handle disconnect
    socket.on("disconnect", async () => {
      try {
        // Find user by socket ID and mark offline
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { $set: { isOnline: false } }
        );

        if (user) {
          console.log(`🔴 User Offline: ${user.fullname} (${user._id})`);
        } else {
          console.log(`🔴 Socket disconnected: ${socket.id}`);
        }
      } catch (error) {
        console.error("❌ Socket Disconnect Error:", error);
      }
    });
  });
};

export default socketHandler;