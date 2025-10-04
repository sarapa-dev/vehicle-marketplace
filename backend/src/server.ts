import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/test", (_, res) => {
  res.json({ message: "Hello from test route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
