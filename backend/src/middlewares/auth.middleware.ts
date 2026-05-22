import { user } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma";

interface DecodedToken extends JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: user;
    }
  }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const token = req.cookies["vehicle_marketplace_user"];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    if (!decoded || !decoded.userId || !decoded.email) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["vehicle_marketplace_user"];

    if (!token || !process.env.JWT_SECRET) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    if (!decoded?.userId || !decoded?.email) return next();

    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (user) req.user = user;

    next();
  } catch {
    next();
  }
};
