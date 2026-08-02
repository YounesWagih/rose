import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  stars = [1, 2, 3, 4, 5];

  hasDiscount() { // api data are inconsistant
    return (
      this.product.priceAfterDiscount > 0 &&
      this.product.priceAfterDiscount < this.product.price
    );
  }

  currentPrice() {
    return this.hasDiscount()
      ? this.product.priceAfterDiscount
      : this.product.price;
  }
}
