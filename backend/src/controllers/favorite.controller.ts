import type { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user.user_id;

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        listing: {
          select: {
            listing_id: true,
            title: true,
            year: true,
            mileage: true,
            is_promoted: true,
            listing_photo: { select: { listing_photo_id: true, url: true }, take: 1 },
            listing_price: {
              select: { listing_price_id: true, price: true },
              orderBy: { created_at: "desc" },
              take: 1,
            },
            manufacturer: { select: { name: true } },
            engine: {
              select: { fuel: true, transmission: true, displacement: true, horsepower: true },
            },
            favorite: { where: { user_id: req.user?.user_id }, select: { favorite_id: true } },
          },
        },
      },
      omit: { listing_id: true, user_id: true },
      orderBy: { created_at: "desc" },
    });

    const transformed = favorites.map(({ listing }) => {
      const { favorite, ...rest } = listing;
      return {
        ...rest,
        is_favorite: true,
      };
    });

    return res.json(transformed);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

export const addFavorite = async (req: Request<{}, {}, { listing_id: string }>, res: Response) => {
  try {
    const listingId = Number(req.body.listing_id);

    if (isNaN(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const ownListing = await prisma.listing.findUnique({
      where: { listing_id: listingId, deleted_at: null },
      select: { user_id: true },
    });

    if (!ownListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (ownListing.user_id === req.user.user_id) {
      return res.status(403).json({ message: "Cannot favorite your own listing" });
    }

    const userId = req.user.user_id;

    const favorite = await prisma.favorite.create({
      data: {
        listing_id: listingId,
        user_id: userId,
      },
    });

    return res.status(201).json(favorite);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Listing already added to favorites" });
    }

    console.error("Error adding favorite:", error);
    return res.status(500).json({ message: "Failed to add favorite" });
  }
};

export const removeFavorite = async (req: Request<{ listing_id: string }>, res: Response) => {
  try {
    const listingId = Number(req.params.listing_id);

    if (isNaN(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const ownListing = await prisma.listing.findUnique({
      where: { listing_id: listingId },
      select: { user_id: true },
    });

    if (!ownListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (ownListing.user_id === req.user.user_id) {
      return res.status(403).json({ message: "Cannot favorite your own listing" });
    }

    const userId = req.user.user_id;

    await prisma.favorite.deleteMany({
      where: {
        listing_id: listingId,
        user_id: userId,
      },
    });

    return res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return res.status(500).json({ message: "Failed to remove favorite" });
  }
};
