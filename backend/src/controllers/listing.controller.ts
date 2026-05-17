import { Request, Response } from "express";
import prisma from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

export const getFeaturedListings = async (_req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        is_promoted: true,
        status: "active",
      },
      take: 12,
      select: {
        listing_id: true,
        title: true,
        year: true,
        listing_photo: { select: { listing_photo_id: true, url: true }, take: 1 },
        listing_price: {
          omit: { listing_id: true, created_at: true },
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });

    return res.json(listings);
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return res.status(500).json({ message: "Failed to fetch featured vehicles" });
  }
};

export const getDiscountedListings = async (_req: Request, res: Response) => {
  try {
    // TODO: add price_changes_count field into listing table
    // prisma currently cannot fetch listings with over 2 listing price record
    const listings = await prisma.listing.findMany({
      where: { status: "active" },
      select: {
        listing_id: true,
        title: true,
        year: true,
        listing_photo: { select: { listing_photo_id: true, url: true }, take: 1 },
        listing_price: {
          select: { listing_price_id: true, price: true },
          orderBy: { created_at: "desc" },
          take: 2,
        },
      },
      orderBy: { listing_id: "desc" },
      take: 50,
    });

    // manual check for total prices and if latest price is less than previous
    const discountedListings = listings
      .filter((listing) => {
        const prices = listing.listing_price;
        return prices.length >= 2 && prices[0]!.price < prices[1]!.price;
      })
      .slice(0, 10);

    return res.json(discountedListings);
  } catch (error) {
    console.error("Error fetching discounted listings:", error);
    return res.status(500).json({ message: "Failed to fetch discounted vehicles" });
  }
};

export const getRecentlySoldListings = async (_req: Request, res: Response) => {
  try {
    // 24 hours ago
    const time = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentlySoldListings = await prisma.listing.findMany({
      where: {
        status: "sold",
        listing_sale: { sold_at: { gte: time } },
      },
      orderBy: {
        listing_sale: { sold_at: "desc" },
      },
      take: 10,
      select: {
        listing_id: true,
        title: true,
        year: true,
        listing_photo: { select: { listing_photo_id: true, url: true }, take: 1 },
        listing_price: {
          select: { listing_price_id: true, price: true },
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });

    return res.json(recentlySoldListings);
  } catch (error) {
    console.error("Error fetching recently sold listings:", error);
    return res.status(500).json({ message: "Failed to fetch sold vehicles" });
  }
};

interface CreateListingBody {
  title: string;
  description: string;
  year: number;
  mileage: number;
  category_id: number;
  manufacturer_id: number;
  displacement: number;
  fuel: "petrol" | "diesel" | "hybrid" | "electric";
  horsepower: number;
  euro_standard: string;
  transmission: "manual" | "automatic";
  features: number[];
  price: number;
  images: string[];
}

export const createListing = async (req: Request<{}, {}, CreateListingBody>, res: Response) => {
  const {
    title,
    description,
    year,
    mileage,
    category_id,
    manufacturer_id,
    displacement,
    fuel,
    horsepower,
    euro_standard,
    transmission,
    features,
    price,
    images,
  } = req.body;

  try {
    if (
      !title ||
      !description ||
      !year ||
      !mileage ||
      !category_id ||
      !manufacturer_id ||
      !displacement ||
      !fuel ||
      !horsepower ||
      !euro_standard ||
      !transmission ||
      !Array.isArray(features) ||
      features.length === 0 ||
      !price ||
      !images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const base64Pattern = /^data:image\/(jpeg|jpg|png|webp|avif);base64,/;
    for (const imgage of images) {
      if (!base64Pattern.test(imgage)) {
        return res.status(400).json({ message: "Invalid or unsupported image format" });
      }
    }

    const userId = req.user.user_id;

    const listingCount = await prisma.listing.count({ where: { user_id: userId } });

    const userSub = await prisma.user_subscription.findFirst({
      where: { user_id: userId, status: "active" },
      include: { subscription_plan: true },
    });

    if (!userSub) {
      return res.status(403).json({ message: "No active subscription found" });
    }

    if (listingCount >= userSub.subscription_plan.max_listings) {
      return res.status(400).json({
        message: "Maximum number of listings reached for your plan",
      });
    }

    const validSubcategory = await prisma.category.findFirst({
      where: { category_id: Number(category_id) },
    });

    if (!validSubcategory || validSubcategory.parent__category_id === null) {
      return res.status(400).json({ message: "Please choose an adequate subcategory" });
    }

    if (new Date().getFullYear() < Number(year)) {
      return res.status(400).json({ message: "Year cannot be in the future" });
    }

    const uploadedImages = await Promise.all(
      images.map((image) =>
        cloudinary.uploader.upload(image, {
          folder: "vehicle_marketplace",
          resource_type: "image",
          quality: "auto",
          format: "avif",
        }),
      ),
    );

    // DOCS: https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
    await prisma.$transaction(async (tx) => {
      const engine = await tx.engine.findFirst({
        where: {
          manufacturer_id: Number(manufacturer_id),
          displacement: Number(displacement),
          fuel,
          horsepower: Number(horsepower),
          euro_standard,
          transmission,
        },
      });

      const engine_id = engine
        ? engine.engine_id
        : (
            await tx.engine.create({
              data: {
                manufacturer_id: Number(manufacturer_id),
                displacement: Number(displacement),
                fuel,
                horsepower: Number(horsepower),
                euro_standard,
                transmission,
              },
            })
          ).engine_id;

      const newListing = await tx.listing.create({
        data: {
          title,
          description,
          year: Number(year),
          mileage: Number(mileage),
          user_id: userId,
          engine_id: Number(engine_id),
          manufacturer_id: Number(manufacturer_id),
          category_id: Number(category_id),
        },
      });

      await tx.listing_price.create({
        data: {
          listing_id: newListing.listing_id,
          price: Number(price),
        },
      });

      await tx.listing_photo.createMany({
        data: uploadedImages.map((image) => ({
          listing_id: newListing.listing_id,
          url: image.secure_url,
        })),
      });

      const featureData = features.map((fid: number) => ({
        listing_id: newListing.listing_id,
        feature_id: fid,
      }));

      await tx.listing_feature.createMany({ data: featureData });

      return newListing;
    });

    return res.status(201).json({ message: "Listing created successfully" });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
