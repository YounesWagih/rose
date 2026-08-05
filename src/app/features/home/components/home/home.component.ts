import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/models/product.model';
import { CategoryService } from '../../../category/services/category.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  adaptCategoryToCard,
  CategoryCard,
} from '../../adapters/category-card.adapter';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categories = signal<CategoryCard[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  heroBanners = [
    'assets/home/hero-banner.jpg',
    'assets/home/hero-banner-2.png',
    'assets/home/hero-banner-3.png',
  ];
  currentBanner = signal(0);
  premiumStart = 0;
  popularMobileIndices = [0, 1, 2];
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
  private bannerTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.bannerTimer = setInterval(() => this.moveBanner(1), 5000);

    forkJoin({
      categories: this.categoryService.getCategories(),
      products: this.productService.getProducts(),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories.set(
          categories.categories.slice(0, 5).map(adaptCategoryToCard),
        );
        this.products.set(products.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Could not load the home page data.');
      },
    });
  }

  ngOnDestroy() {
    clearInterval(this.bannerTimer);
  }

  moveBanner(direction: number) {
    this.currentBanner.set(
      this.moveIndex(
        this.currentBanner(),
        direction,
        this.heroBanners.length,
      ),
    );
  }

  showBanner(index: number) {
    this.currentBanner.set(index);
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

  getPopularProducts() {
    return this.products().slice(3, 15);
  }

  getPopularMobileProducts() {
    const products = this.getPopularProducts();

    return this.popularMobileIndices
      .slice(0, Math.min(3, products.length))
      .map((productIndex) => products[productIndex % products.length]);
  }

  movePopularProduct(cardIndex: number, direction: number) {
    const productCount = this.getPopularProducts().length;
    if (productCount <= 1) return;

    const occupiedIndices = new Set(
      this.popularMobileIndices
        .slice(0, Math.min(3, productCount))
        .filter((_, index) => index !== cardIndex)
        .map((index) => index % productCount),
    );
    let nextIndex = this.popularMobileIndices[cardIndex] % productCount;

    do {
      nextIndex = this.moveIndex(nextIndex, direction, productCount);
    } while (occupiedIndices.has(nextIndex));

    this.popularMobileIndices = this.popularMobileIndices.map((index, position) =>
      position === cardIndex ? nextIndex : index,
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

  isPopularCategoryActive(name: string, isFirst: boolean) {
    const hasGiftsBox = this.categories().some(
      (category) => category.name.trim().toLowerCase() === 'gifts box',
    );

    return name.trim().toLowerCase() === 'gifts box' || (!hasGiftsBox && isFirst);
  }

  private moveIndex(current: number, direction: number, length: number) {
    return length === 0
      ? 0
      : (((current + direction) % length) + length) % length;
  }
}
