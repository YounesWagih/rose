import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Category } from '../../shared/models/category.model';
import { Product } from '../../shared/models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  heroBanners = [
    'assets/home/hero-banner.jpg',
    'assets/home/hero-banner-2.png',
    'assets/home/hero-banner-3.png',
  ];
  currentBanner = 0;
  premiumStart = 0;
  reviewStart = 0;

  reviews = [
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-1.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-2.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-3.png',
    },
    {
      name: 'Ahmed Mohamed',
      role: 'Customer',
      image: 'assets/home/reviews/review-avatar-4.png',
    },
  ];

  trustedCompanies = [1, 2, 3, 4, 5, 6];

  ngOnInit() {
    forkJoin({
      categories: this.categoryService.getCategories(),
      products: this.productService.getProducts(),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories.set(categories.categories.slice(0, 5));
        this.products.set(products.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Could not load the home page data.');
      },
    });
  }

  moveBanner(direction: number) {
    this.currentBanner = this.moveIndex(
      this.currentBanner,
      direction,
      this.heroBanners.length,
    );
  }

  showBanner(index: number) {
    this.currentBanner = index;
  }

  getPremiumProducts() {
    const products = this.products();
    return Array.from(
      { length: Math.min(3, products.length) },
      (_, index) => products[(this.premiumStart + index) % products.length],
    );
  }

  moveProducts(direction: number) {
    this.premiumStart = this.moveIndex(
      this.premiumStart,
      direction,
      this.products().length,
    );
  }

  getReviews() {
    return this.reviews.map(
      (_, index) =>
        this.reviews[(this.reviewStart + index) % this.reviews.length],
    );
  }

  moveReviews(direction: number) {
    this.reviewStart = this.moveIndex(
      this.reviewStart,
      direction,
      this.reviews.length,
    );
  }

  private moveIndex(current: number, direction: number, length: number) {
    return length === 0
      ? 0
      : (((current + direction) % length) + length) % length;
  }
}
