import { Link } from "react-router";
import { Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="size-6 text-primary" />
              <span className="text-xl font-bold">Vehicle Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted marketplace for buying and selling vehicles of all types.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Buy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-primary">
                  Search Cars
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Search Motorcycles
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Search Trucks
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Sell</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/create-listing" className="hover:text-primary">
                  List Your Vehicle
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Pricing Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Seller Resources
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vehicle Marketplace All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
