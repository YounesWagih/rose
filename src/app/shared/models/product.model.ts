export interface Product {
  _id: string;
  title: string;
  imgCover: string;
  price: number;
  priceAfterDiscount: number;
  discount: number;
  rateAvg: number;
  quantity: number;
}

export interface ProductsResponse {
  products: Product[];
}
