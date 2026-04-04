import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addReview, getItemReviews, getShopReviews } from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", isAuth, addReview);
reviewRouter.get("/item/:itemId", getItemReviews);
reviewRouter.get("/shop/:shopId", getShopReviews);

export default reviewRouter;
