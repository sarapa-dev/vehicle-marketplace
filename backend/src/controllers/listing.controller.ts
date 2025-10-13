import { Request, Response } from "express";
import prisma from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

interface CreateListingBody {
  title: string;
  description: string;
  category_id: number;
  manufacturer_id: number;
  engine_id: number;
  features: number[];
  price: number;
  image: string;
}

export const createListing = async (req: Request<{}, {}, CreateListingBody>, res: Response) => {
  const { title, description, category_id, manufacturer_id, engine_id, features, price, image } =
    req.body;

  try {
    if (
      !title ||
      !description ||
      !category_id ||
      !manufacturer_id ||
      !engine_id ||
      !Array.isArray(features) ||
      features.length === 0 ||
      !price ||
      !image
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const base64Pattern = /^data:image\/(jpeg|jpg|png|webp|avif);base64,/;
    if (!base64Pattern.test(image)) {
      return res.status(400).json({ message: "Invalid or unsupported image format" });
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

    // TODO: Add array of images upload feature
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "vehicle_marketplace",
      resource_type: "image",
      quality: "auto",
      format: "avif",
    });

    // DOCS: https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
    const result = await prisma.$transaction(async (tx) => {
      const newListing = await tx.listing.create({
        data: {
          title,
          description,
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

      await tx.listing_photo.create({
        data: {
          listing_id: newListing.listing_id,
          url: uploadedImage.secure_url,
        },
      });

      const featureData = features.map((fid: number) => ({
        listing_id: newListing.listing_id,
        feature_id: fid,
      }));

      await tx.listing_feature.createMany({ data: featureData });

      return newListing;
    });

    return res.status(201).json({ message: "Listing created successfully", listing: result });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
