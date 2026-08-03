import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardItem } from '../../models/product.model';
import {
  getCurrentProductPrice,
  hasProductDiscount
} from '../../utils/product-price.util';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardItem;

  stars = [1, 2, 3, 4, 5];
  hasDiscount = hasProductDiscount;
  currentPrice = getCurrentProductPrice;
}
