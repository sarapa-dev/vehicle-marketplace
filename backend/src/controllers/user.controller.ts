import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getUserProfile = async (req: Request<{ user_id: string }>, res: Response) => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      omit: { password: true },
    });

    if (!user) {
      return res.status(404).json({ message: `User with id ${userId} not found` });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (req: Request<{ user_id: string }>, res: Response) => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (req.user.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { first_name, last_name, phone_number, postal_address } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        first_name,
        last_name,
        phone_number,
        postal_address,
      },
      omit: {
        password: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Failed to update user profile",
    });
  }
};

export const getUserListings = async (req: Request<{ user_id: string }>, res: Response) => {
  try {
    const userId = Number(req.params.user_id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const listings = await prisma.listing.findMany({
      where: { user_id: userId },
      include: {
        listing_photo: {
          omit: { listing_id: true },
          take: 1,
        },
        listing_price: {
          orderBy: { created_at: "desc" },
          omit: { listing_id: true, created_at: true },
          take: 1,
        },
        manufacturer: { omit: { manufacturer_id: true } },
        engine: { omit: { engine_id: true, euro_standard: true, manufacturer_id: true } },
      },
      orderBy: { listing_id: "desc" },
      omit: {
        user_id: true,
        category_id: true,
        manufacturer_id: true,
        engine_id: true,
        description: true,
        status: true,
      },
    });

    return res.json(listings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return res.status(500).json({ message: "Failed to fetch user listings" });
  }
};
