import { Product } from '../models/product.model';

export function hasProductDiscount(product: Product) {
  return product.priceAfterDiscount > 0 && product.priceAfterDiscount < product.price;
}

export function getCurrentProductPrice(product: Product) {
  return hasProductDiscount(product) ? product.priceAfterDiscount : product.price;
}
