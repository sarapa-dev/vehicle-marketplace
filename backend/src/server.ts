import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoute from "./routes/auth.route";

const app = express();

const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
