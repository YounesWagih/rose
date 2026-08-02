import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, Subscription, switchMap } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../shared/models/product.model';
import {
  getCurrentProductPrice,
  hasProductDiscount
} from '../../shared/utils/product-price.util';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, ProductCardComponent, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  product = signal<Product | null>(null);
  productImages = signal<string[]>([]);
  selectedImage = signal('');
  relatedProducts = signal<Product[]>([]);
  categoryName = signal('Unknown');
  errorMessage = signal('');

  quantity = 1;
  colors = ['#606ddd', '#4caf50', '#17a2b8', '#ffc107', '#f44336'];
  hasDiscount = hasProductDiscount;
  currentPrice = getCurrentProductPrice;

  private productSubscription?: Subscription;

  ngOnInit() {
    this.productSubscription = this.route.paramMap
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
            related: this.productService.getProducts({
              categories: [product.category],
              limit: 5
            }).pipe(
              catchError(() => of({ products: [] }))
            )
          }).pipe(
            map((response) => ({
              product,
              categoryName: response.category?.category.name ?? 'Unknown',
              related: response.related.products
                .filter((item) => item._id !== product._id)
                .slice(0, 4)
            }))
          )
        )
      )
      .subscribe({
        next: ({ product, categoryName, related }) => {
          const images = [product.imgCover, ...product.images]
            .filter((image, index, allImages) => image && allImages.indexOf(image) === index)
            .slice(0, 4);

          this.product.set(product);
          this.productImages.set(images);
          this.selectedImage.set(images[0]);
          this.relatedProducts.set(related);
          this.categoryName.set(categoryName);
          this.quantity = 1;
        },
        error: () => {
          this.errorMessage.set('Could not load this product.');
        }
      });
  }

  ngOnDestroy() {
    this.productSubscription?.unsubscribe();
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
}
