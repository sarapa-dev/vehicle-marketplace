export interface Category {
  category_id: number;
  name: string;
  parent__category_id?: number | null;
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
