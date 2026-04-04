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
import reviewRouter from "./routes/review.routes.js";
import socketHandler from "./socket.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
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

// Allow all origins to enable testing from mobile / different local IPs
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

socketHandler(io);

const startServer = async () => {
  await connectDb();
  server.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
  });
};

startServer();
