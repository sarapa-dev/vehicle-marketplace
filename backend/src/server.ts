import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import listingRoute from "./routes/listing.route";
import categoryRoutes from "./routes/category.route";
import manufacturerRoutes from "./routes/manufacturer.route";
import engineRoutes from "./routes/engine.route";
import featureRoutes from "./routes/feature.route";
import subscriptionRoutes from "./routes/subscription.route";

const app = express();

const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/subscription/webhook") {
    return next();
  }
  return express.json({ limit: "10mb" })(req, res, next);
});

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/listings", listingRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/engines", engineRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
