import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData?._id || userData?.role !== 'deliveryBoy') return;

    const updateLocation = async (lat, lon) => {
      try {
        console.log("📍 Updating delivery boy location:", { lat, lon });
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Location update failed:", error);
      }
    };

    // Update immediately when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting initial location:", error);
        }
      );
    }

    // Watch position for updates
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => console.error("Geolocation error:", err),
      { 
        enableHighAccuracy: true, 
        maximumAge: 10000,
        timeout: 5000 
      }
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData?._id, userData?.role]);
};

export default useUpdateLocation;