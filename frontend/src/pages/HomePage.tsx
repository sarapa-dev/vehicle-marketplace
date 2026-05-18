import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ListingsRow } from "@/components/home/ListingsRow";
import { SearchBar } from "@/components/search/SearchBar";
import { useDiscountedListings } from "@/hooks/useListing";
import { useRecentlySoldListings } from "@/hooks/useListing";

export default function HomePage() {
  const { discountedListings, isLoading: discountedLoading } = useDiscountedListings();
  const { recentlySoldListings, isLoading: soldLoading } = useRecentlySoldListings();

  return (
    <div className="flex flex-col gap-12">
      <div className="max-w-4xl mt-10">
        <SearchBar />
      </div>

      <FeaturedSection />

      <ListingsRow
        title="Price Reduced"
        listings={discountedListings}
        isLoading={discountedLoading}
        showDiscount
        viewAllHref="/search?discounted=true"
      />

      <ListingsRow
        title="Recently Sold"
        listings={recentlySoldListings}
        isLoading={soldLoading}
        isSold
        viewAllHref="/search?status=sold"
      />
    </div>
  );
}
