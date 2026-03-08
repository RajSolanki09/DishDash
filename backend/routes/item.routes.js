import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addItem, deleteItem, editItem, getItemById, getItemsByCity, rating, searchItems } from "../controllers/item.controller.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.put("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-item-by-id/:itemId", isAuth, getItemById);
itemRouter.delete("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-by-city/:city", isAuth, getItemsByCity);
itemRouter.get("/search-items",searchItems)
itemRouter.post("/rating",rating)


export default itemRouter;