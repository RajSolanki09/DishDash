import express from "express";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { updateUserLocation } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser);
userRouter.post("/update-location",isAuth, updateUserLocation);
userRouter.put("/update-profile", isAuth, updateProfile);
export default userRouter;