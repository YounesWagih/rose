import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginPopupService } from '../../../core/services/login-popup.service';
import { WishlistService } from '../../../core/services/wishlist.service';
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
  private readonly auth = inject(AuthService);
  private readonly loginPopup = inject(LoginPopupService);
  readonly wishlist = inject(WishlistService);

  @Input({ required: true }) product!: ProductCardItem;

  stars = [1, 2, 3, 4, 5];
  hasDiscount = hasProductDiscount;
  currentPrice = getCurrentProductPrice;

  toggleWishlist(): void {
    if (!this.auth.isAuthenticated()) {
      this.loginPopup.open();
      return;
    }

    this.wishlist.toggle(this.product._id);
  }
}
