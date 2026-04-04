import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";

// Dynamically use localhost or network IP based on where the app is opened
const backendHost = window.location.hostname === "localhost" ? "localhost" : window.location.hostname;
const defaultBaseUrl = `http://${backendHost}:8000`;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = defaultBaseUrl;

// Actions and Hooks
import { setSocket } from "./redux/userSlice";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrder";
import useUpdateLocation from "./hooks/useUpdateLocation";

// Components (loaded eagerly - small & critical)
import ErrorBoundary from "./components/ErrorBoundary";
import PageRouteLoader from "./components/PageRouteLoader";
import CustomCursor from "./components/CustomCursor";

// Pages (lazy loaded - code splitting)
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const CreateEditShop = lazy(() => import("./pages/CreateEditShop"));
const AddItem = lazy(() => import("./pages/AddItem"));
const EditItem = lazy(() => import("./pages/EditItem"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckOut = lazy(() => import("./pages/CheckOut"));
const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const Shop = lazy(() => import("./pages/Shop"));
const Favorites = lazy(() => import("./pages/Favorites"));
const DeliveryBoy = lazy(() => import("./components/DeliveryBoy"));
const DeliveryDashboard = lazy(() => import("./pages/Deliverydashboard"));

export const serverUrl = defaultBaseUrl;

// Loading fallback wrapper
const PageLoader = ({ children }) => (
  <Suspense fallback={<PageRouteLoader />}>
    {children}
  </Suspense>
);

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

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
        () => {},
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
        console.log("Socket connected:", socketInstance.id);
        socketInstance.emit("identity", { userID: userData._id });
      });

      socketInstance.on("connect_error", (err) => {
        console.log("Socket Connection Error:", err.message);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userData, dispatch]);

  return (
    <ErrorBoundary>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<PageLoader><Home /></PageLoader>} />
        <Route
          path="/signup"
          element={!userData ? <PageLoader><SignUp /></PageLoader> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <PageLoader><SignIn /></PageLoader> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <PageLoader><ForgotPassword /></PageLoader> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={userData ? <PageLoader><Profile /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route path="/about" element={<PageLoader><AboutUs /></PageLoader>} />
        <Route
          path="/create-edit-shop"
          element={userData ? <PageLoader><CreateEditShop /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/add-item"
          element={userData ? <PageLoader><AddItem /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/edit-item/:itemId"
          element={userData ? <PageLoader><EditItem /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/cart"
          element={userData ? <PageLoader><CartPage /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/checkOut"
          element={userData ? <PageLoader><CheckOut /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/order-placed"
          element={userData ? <PageLoader><OrderPlaced /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/my-orders"
          element={userData ? <PageLoader><MyOrders /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/owner-orders"
          element={userData ? <PageLoader><MyOrders /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/delivery-orders"
          element={userData ? <PageLoader><DeliveryBoy /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/delivery-dashboard"
          element={userData ? <PageLoader><DeliveryDashboard /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/track-order/:orderId"
          element={userData ? <PageLoader><TrackOrderPage /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/shop/:shopId"
          element={userData ? <PageLoader><Shop /></PageLoader> : <Navigate to="/signin" />}
        />
        <Route
          path="/favorites"
          element={userData ? <PageLoader><Favorites /></PageLoader> : <Navigate to="/signin" />}
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
