export interface Category {
  _id: string;
  name: string;
  image: string;
  productsCount: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  category: Category;
}
