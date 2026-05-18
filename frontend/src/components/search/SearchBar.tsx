import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManufacturers } from "@/hooks/useManufacturer";
import { useSubcategories } from "@/hooks/useCategory";
import { cn } from "@/lib/utils";

const FUEL_OPTIONS = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
];

const TRANSMISSION_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => String(CURRENT_YEAR - i));

interface SearchFormState {
  category_id: string;
  manufacturer_id: string;
  price_min: string;
  price_max: string;
  year_from: string;
  year_to: string;
  fuel: string;
  transmission: string;
}

const EMPTY_FORM: SearchFormState = {
  category_id: "",
  manufacturer_id: "",
  price_min: "",
  price_max: "",
  year_from: "",
  year_to: "",
  fuel: "",
  transmission: "",
};

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { manufacturers = [] } = useManufacturers();
  const { subcategories = [] } = useSubcategories(1);

  const [form, setForm] = useState<SearchFormState>({
    category_id: searchParams.get("category_id") ?? "",
    manufacturer_id: searchParams.get("manufacturer_id") ?? "",
    price_min: searchParams.get("price_min") ?? "",
    price_max: searchParams.get("price_max") ?? "",
    year_from: searchParams.get("year_from") ?? "",
    year_to: searchParams.get("year_to") ?? "",
    fuel: searchParams.get("fuel") ?? "",
    transmission: searchParams.get("transmission") ?? "",
  });

  const setField = (field: keyof SearchFormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const hasActiveFilters = Object.values(form).some(Boolean);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    navigate("/search");
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Select value={form.category_id} onValueChange={(v) => setField("category_id", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((c) => (
              <SelectItem key={c.category_id} value={String(c.category_id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={form.manufacturer_id} onValueChange={(v) => setField("manufacturer_id", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            {manufacturers.map((m) => (
              <SelectItem key={m.manufacturer_id} value={String(m.manufacturer_id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            type="number"
            placeholder="Min price"
            value={form.price_min}
            onChange={(e) => setField("price_min", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pr-7"
            min={0}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
        </div>

        <div className="relative">
          <Input
            type="number"
            placeholder="Max price"
            value={form.price_max}
            onChange={(e) => setField("price_max", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pr-7"
            min={0}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
        </div>

        <Select value={form.year_from} onValueChange={(v) => setField("year_from", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year from" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={form.year_to} onValueChange={(v) => setField("year_to", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year to" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {YEARS.filter((y) => !form.year_from || Number(y) >= Number(form.year_from)).map(
              (y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <Select value={form.fuel} onValueChange={(v) => setField("fuel", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Fuel type" />
          </SelectTrigger>
          <SelectContent>
            {FUEL_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={form.transmission} onValueChange={(v) => setField("transmission", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            {TRANSMISSION_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 flex gap-2">
        <Button onClick={handleSearch} className="flex-1 gap-2">
          <Search className="size-4" />
          Search
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={handleClear} aria-label="Clear filters">
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
