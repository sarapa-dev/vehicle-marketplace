import jwt from "jsonwebtoken";
import { user } from "@prisma/client";
import { Response } from "express";

export const generateTokenAndSetCookie = (user: user, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("vehicle_marketplace_user", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
