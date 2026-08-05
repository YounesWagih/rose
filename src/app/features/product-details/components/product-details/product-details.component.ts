import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product, ProductCardItem } from '../../../../shared/models/product.model';
import {
  getCurrentProductPrice,
  hasProductDiscount
} from '../../../../shared/utils/product-price.util';
import { LoginPopupService } from '../../../auth/services/login-popup.service';
import { CategoryService } from '../../../category/services/category.service';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, ProductCardComponent, RouterLink, CarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly loginPopup = inject(LoginPopupService);
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);

  product = signal<Product | null>(null);
  productImages = signal<string[]>([]);
  selectedImage = signal('');
  relatedProducts = signal<ProductCardItem[]>([]);
  categoryName = signal('Unknown');
  errorMessage = signal('');

  quantity = 1;
  colors = ['#606ddd', '#4caf50', '#17a2b8', '#ffc107', '#f44336'];
  hasDiscount = hasProductDiscount;
  currentPrice = getCurrentProductPrice;
  readonly relatedCarouselOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    smartSpeed: 500,
    margin: 24,
    responsive: {
      0: { items: 1, margin: 16 },
      600: { items: 2, margin: 24 },
      900: { items: 3, margin: 24 },
      1200: { items: 4, margin: 24 }
    }
  };

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.errorMessage.set('');
          this.product.set(null);
          this.relatedProducts.set([]);
          return this.productService.getProductById(params.get('id') ?? '');
        }),
        switchMap(({ product }) =>
          forkJoin({
            category: this.categoryService.getCategoryById(product.category).pipe(
              catchError(() => of(null))
            ),
            related: this.productService.getRelatedProducts(product._id).pipe(
              catchError(() => of({ relatedProducts: [] }))
            )
          }).pipe(
            map((response) => ({
              product,
              categoryName: response.category?.category.name ?? 'Unknown',
              related: response.related.relatedProducts.slice(0, 4)
            }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ product, categoryName, related }) => {
          const images = [...new Set([product.imgCover, ...product.images])]
            .filter(Boolean)
            .slice(0, 4);

          this.product.set(product);
          this.productImages.set(images);
          this.selectedImage.set(images[0] ?? '');
          this.relatedProducts.set(related);
          this.categoryName.set(categoryName);
          this.quantity = 1;
        },
        error: () => {
          this.errorMessage.set('Could not load this product.');
        }
      });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    const product = this.product();

    if (product && this.quantity < product.quantity) {
      this.quantity++;
    }
  }

  toggleWishlist(): void {
    const product = this.product();

    if (!product) {
      return;
    }

    if (!this.auth.isAuthenticated()) {
      this.loginPopup.open();
      return;
    }

    this.wishlist.toggle(product._id);
  }

  addToCart(): void {
    const product = this.product();

    if (!product) {
      return;
    }

    if (!this.auth.isAuthenticated()) {
      this.loginPopup.open();
      return;
    }

    this.cart.add(product._id, this.quantity);
  }
}
