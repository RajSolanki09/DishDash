import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import socketHandler from "./socket.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  },
});

app.set("io", io);

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// Update CORS to be very specific
app.use(
  cors({
    origin: "http://localhost:5173", // Aapka Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

socketHandler(io);
server.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
  connectDb();
});
