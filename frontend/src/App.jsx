import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

// Actions and Hooks
import { setSocket } from "./redux/userSlice";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrder";
import useUpdateLocation from "./hooks/useUpdateLocation";

// Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import DeliveryDashboard from "./pages/Deliverydashboard";

export const serverUrl = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  // Custom Hooks
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useUpdateLocation();

  // Location Fetch
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
      );
    }
  }, []);

  // Socket Connection
  useEffect(() => {
    let socketInstance;

    if (userData && userData._id) {
      socketInstance = io(serverUrl, {
        withCredentials: true,
        transports: ["websocket"],
      });

      dispatch(setSocket(socketInstance));

      socketInstance.on("connect", () => {
        console.log("✅ Socket connected successfully! ID:", socketInstance.id);
        socketInstance.emit("identity", { userID: userData._id });
      });

      socketInstance.on("connect_error", (err) => {
        console.log("❌ Socket Connection Error:", err.message);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("🔌 Socket Disconnected");
      }
    };
  }, [userData, dispatch]);

  return (
    <Routes>
      {/* ═══════════════════════════════════════════════════════════
                PUBLIC ROUTES - Accessible without login
            ═══════════════════════════════════════════════════════════ */}

      {/* Home route - shows Landing or Dashboard based on login state */}
      <Route path="/" element={<Home />} />

      {/* Auth routes - redirect to home if already logged in */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route path="/about" element={<AboutUs />} />
      {/* ═══════════════════════════════════════════════════════════
                PROTECTED ROUTES - Require authentication
            ═══════════════════════════════════════════════════════════ */}
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/checkOut"
        element={userData ? <CheckOut /> : <Navigate to="/signin" />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to="/signin" />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to="/signin" />}
      />
      <Route
        path="/owner-orders"
        element={userData ? <MyOrders /> : <Navigate to="/signin" />}
      />
       <Route
        path="/delivery-orders"
        element={userData ? <DeliveryDashboard /> : <Navigate to="/signin" />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;
