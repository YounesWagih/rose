export interface ProductCardItem {
  _id: string;
  title: string;
  imgCover: string;
  price: number;
  priceAfterDiscount: number;
  discount: number;
  rateAvg: number;
  quantity?: number;
}

export interface Product extends ProductCardItem {
  slug: string;
  description: string;
  images: string[];
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

export interface RelatedProductsResponse {
  relatedProducts: ProductCardItem[];
}

export interface ProductFilters {
  keyword?: string;
  categories?: string[];
  maxPrice?: number;
  minimumRating?: number;
  stock?: 'in' | 'out';
  onSale?: boolean;
  limit?: number;
}
