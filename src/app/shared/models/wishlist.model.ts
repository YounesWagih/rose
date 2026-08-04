import { ProductCardItem } from './product.model';

export interface WishlistResponse {
  count: number;
  wishlist: {
    products: ProductCardItem[];
  };
}
