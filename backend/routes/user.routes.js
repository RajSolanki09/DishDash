import express from "express";
import { getCurrentUser, updateProfile, toggleFavorite, getFavorites, toggleDutyStatus, getUserById } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { updateUserLocation } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser);
userRouter.get("/:userId", isAuth, getUserById); // ✅ Get user by ID (for delivery boy details)
userRouter.post("/update-location",isAuth, updateUserLocation);
userRouter.put("/update-profile", isAuth, updateProfile);
userRouter.post("/toggle-favorite", isAuth, toggleFavorite);
userRouter.get("/get-favorites", isAuth, getFavorites);
userRouter.post("/toggle-duty", isAuth, toggleDutyStatus);
export default userRouter;