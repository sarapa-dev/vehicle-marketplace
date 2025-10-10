import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie";

export const register = async (req: Request<{}, {}, Prisma.userCreateInput>, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must contain at least 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });

    generateTokenAndSetCookie(user, res);

    const freePlan = await prisma.subscription_plan.findFirst({
      where: { name: { equals: "Free" } },
    });

    if (!freePlan) {
      return res.status(500).json({ message: "Free plan not found in the database" });
    }

    await prisma.user_subscription.create({
      data: {
        user_id: user.user_id,
        subscription_plan_id: freePlan.subscription_plan_id,
        status: "active",
      },
    });

    res.status(201).json({ user: { ...user, password: "" } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request<{}, {}, Prisma.userCreateInput>, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "You must fill all fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user, res);

    res.json({ user: { ...user, password: "" } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("vehicle_marketplace_user");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    res.json({
      ...req.user,
      password: "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
