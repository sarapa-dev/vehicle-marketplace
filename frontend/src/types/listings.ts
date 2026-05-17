export interface ListingPhoto {
  listing_photo_id: number;
  url: string;
}

export interface ListingPrice {
  listing_price_id: number;
  price: number;
}

// for home page - featured, discounted, and recently-sold
export interface BaseListing {
  listing_id: number;
  title: string;
  year: number;
  listing_photo: ListingPhoto[];
  listing_price: ListingPrice[];
}

// extended - returned by the search
export interface SearchListing extends BaseListing {
  mileage?: number;
  fuel?: string;
  transmission?: string;
  manufacturer_name?: string;
  engine_displacement?: number;
  engine_horsepower?: number;
  is_promoted?: boolean;
  status?: "active" | "sold";
}
