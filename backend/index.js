import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser)
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    connectDb();
                                
});