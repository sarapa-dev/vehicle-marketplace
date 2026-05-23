import type { Category, Feature } from "./categories";
import type { Engine } from "./engine";
import type { Manufacturer } from "./manufacturer";
import type { UserProfile } from "./user";

export interface ListingPhoto {
  listing_photo_id: number;
  url: string;
}

export interface ListingPrice {
  listing_price_id: number;
  price: number;
  created_at?: string;
}

// Featured + discounted endpoints
export interface BaseListing {
  listing_id: number;
  title: string;
  year: number;
  listing_photo: ListingPhoto[];
  listing_price: ListingPrice[];
  is_favorite?: boolean;
}

export interface SoldListing {
  listing_id: number;
  title: string;
  year: number;
  listing_photo: ListingPhoto[];
  listing_sale: {
    sale_price: number;
    sold_at: string;
  };
}

export type AnyListing = BaseListing | SoldListing;

// Type guard — lets the card component branch on price source
export const isSoldListing = (listing: AnyListing): listing is SoldListing =>
  "listing_sale" in listing;

export interface SearchListing extends BaseListing {
  mileage: number;
  is_promoted: boolean;
  is_favorite?: boolean;
  manufacturer: {
    name: string;
  };
  engine: {
    fuel: string;
    transmission: string;
    displacement: number | null;
    horsepower: number;
  };
}

export interface ListingFeature {
  listing_feature_id: number;
  feature: Feature;
}

export interface ListingDetail {
  listing_id: number;
  title: string;
  year: number;
  mileage: number;
  description: string;
  is_promoted: boolean;
  status: string;
  user: UserProfile;
  category: Category;
  manufacturer: Manufacturer;
  engine: Engine;
  listing_feature: ListingFeature[];
  listing_price: ListingPrice[];
  listing_photo: ListingPhoto[];
}

export interface ListingForEdit {
  listing_id: number;
  title: string;
  year: number;
  mileage: number;
  description: string;
  listing_photo: { listing_photo_id: number; url: string }[];
  listing_price: { price: number }[];
  manufacturer: { manufacturer_id: number; name: string };
  engine: {
    fuel: string;
    transmission: string;
    displacement: number | null;
    horsepower: number;
    euro_standard: string;
  };
  category: {
    category_id: number;
    name: string;
    parent__category_id: number | null;
  };
  listing_feature: {
    feature: { feature_id: number; name: string };
  }[];
}
