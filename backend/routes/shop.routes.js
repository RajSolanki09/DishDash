import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createEditShop, getMyShop, getShopByCity, getShopDetails, toggleShopStatus, getShopAnalytics } from "../controllers/shop.controller.js";
import {upload} from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit",isAuth, upload.single("image"),createEditShop);
shopRouter.get('/get-my',isAuth,getMyShop)
shopRouter.get('/get-by-city/:city',isAuth,getShopByCity)
shopRouter.get("/get-shop-details/:shopId", getShopDetails);
shopRouter.post("/toggle-status", isAuth, toggleShopStatus);
shopRouter.get("/analytics", isAuth, getShopAnalytics);
export default shopRouter;
