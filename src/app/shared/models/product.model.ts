export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  imgCover: string;
  images: string[];
  price: number;
  priceAfterDiscount: number;
  discount: number;
  rateAvg: number;
  quantity: number;
  category: string;
  occasion: string;
  sold?: number;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductDetailsResponse {
  product: Product;
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
