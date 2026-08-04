import { ProductCardItem } from '../../shared/models/product.model';

export interface WishlistResponse {
  count: number;
  wishlist: {
    products: ProductCardItem[];
  };
}
