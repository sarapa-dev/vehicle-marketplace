import { Request, Response } from "express";
import prisma from "../lib/prisma";
import cloudinary from "../lib/cloudinary";
import { Prisma } from "@prisma/client";

export const getListingById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const listingId = Number(id);

    if (isNaN(listingId)) {
      return res.status(400).json({
        message: "Invalid listing id",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { listing_id: listingId },
      include: {
        user: { omit: { password: true } },
        category: { omit: { parent__category_id: true } },
        manufacturer: true,
        engine: { omit: { manufacturer_id: true } },
        listing_feature: {
          select: {
            listing_feature_id: true,
            feature: { select: { feature_id: true, name: true } },
          },
        },
        listing_price: {
          orderBy: {
            created_at: "desc",
          },
          omit: { listing_id: true },
          take: 1,
        },
        listing_photo: { omit: { listing_id: true } },
      },
      omit: {
        user_id: true,
        category_id: true,
        manufacturer_id: true,
        engine_id: true,
      },
    });

    if (!listing) return res.status(404).json({ message: `Listing with id: ${id} not found.` });

    return res.json(listing);
  } catch (error) {
    console.error("Error fetching details about listing:", error);
    return res.status(500).json({ message: "Failed to fetch details about vehicle" });
  }
};

interface SearchListingQuery {
  category_id?: string;
  manufacturer_id?: string;
  price_min?: string;
  price_max?: string;
  year_from?: string;
  year_to?: string;
  fuel?: string;
  transmission?: string;
  page?: string;
  limit?: string;
}

export const searchListings = async (
  req: Request<{}, {}, {}, SearchListingQuery>,
  res: Response,
) => {
  try {
    const {
      category_id,
      manufacturer_id,
      price_min,
      price_max,
      year_from,
      year_to,
      fuel,
      transmission,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.listingWhereInput = {
      status: "active",
      ...(category_id && { category_id: parseInt(category_id) }),
      ...(manufacturer_id && { manufacturer_id: parseInt(manufacturer_id) }),
      ...((year_from || year_to) && {
        year: {
          ...(year_from && { gte: parseInt(year_from) }),
          ...(year_to && { lte: parseInt(year_to) }),
        },
      }),
      // TODO: add is_latest field to listing_price table
      ...((price_min || price_max) && {
        listing_price: {
          some: {
            price: {
              ...(price_min && { gte: parseInt(price_min) }),
              ...(price_max && { lte: parseInt(price_max) }),
            },
          },
        },
      }),
      ...((fuel || transmission) && {
        engine: {
          ...(fuel && { fuel: fuel as Prisma.Enumengine_fuelFilter }),
          ...(transmission && {
            transmission: transmission as Prisma.Enumengine_transmissionFilter,
          }),
        },
      }),
    };

    const [rawListings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { listing_id: "desc" },
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
          favorite: { where: { user_id: req.user?.user_id ?? 0 }, select: { favorite_id: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    const listings = rawListings.map(({ favorite, ...rest }) => ({
      ...rest,
      is_favorite: favorite.length > 0,
    }));

    return res.json({
      data: listings,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error searching listings:", error);
    return res.status(500).json({ message: "Failed to search listings" });
  }
};

export const getFeaturedListings = async (req: Request, res: Response) => {
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
        favorite: { where: { user_id: req.user?.user_id ?? 0 }, select: { favorite_id: true } },
      },
    });

    const transformed = listings.map(({ favorite, ...rest }) => ({
      ...rest,
      is_favorite: favorite.length > 0,
    }));

    return res.json(transformed);
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return res.status(500).json({ message: "Failed to fetch featured vehicles" });
  }
};

export const getDiscountedListings = async (req: Request, res: Response) => {
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
        favorite: { where: { user_id: req.user?.user_id ?? 0 }, select: { favorite_id: true } },
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

    const transformed = discountedListings.map(({ favorite, ...rest }) => ({
      ...rest,
      is_favorite: favorite.length > 0,
    }));

    return res.json(transformed);
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
