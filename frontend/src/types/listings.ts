export interface ListingPhoto {
  listing_photo_id: number;
  url: string;
}

export interface ListingPrice {
  listing_price_id: number;
  price: number;
}

// Featured + discounted endpoints
export interface BaseListing {
  listing_id: number;
  title: string;
  year: number;
  listing_photo: ListingPhoto[];
  listing_price: ListingPrice[];
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
