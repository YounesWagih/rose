export interface Product {
  _id: string;
  title: string;
  imgCover: string;
  price: number;
  priceAfterDiscount: number;
  discount: number;
  rateAvg: number;
  quantity: number;
  category: string;
  sold?: number;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductFilters {
  keyword?: string;
  categories?: string[];
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  minimumRating?: number;
  stock?: 'in' | 'out';
  onSale?: boolean;
  sort?: 'price' | '-price';
  limit?: number;
}
