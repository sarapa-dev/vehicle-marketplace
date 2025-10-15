export interface Category {
  category_id: number;
  name: string;
}

export interface Subcategory extends Category {
  other_category: Category[];
}

export interface Feature {
  feature_id: number;
  name: string;
}

export interface CategoryWithFeatures extends Category {
  feature: Feature[];
}
