import { ProductCardItem } from '../models/product.model';

export function hasProductDiscount(product: ProductCardItem) {
  return product.priceAfterDiscount > 0 && product.priceAfterDiscount < product.price;
}

export function getCurrentProductPrice(product: ProductCardItem) {
  return hasProductDiscount(product) ? product.priceAfterDiscount : product.price;
}
