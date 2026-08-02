import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Category } from '../../shared/models/category.model';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    'assets/home/hero-banner-3.png'
  ];
  currentBanner = 0;
  premiumStart = 0;
  reviewStart = 0;

  reviews = [
    { name: 'Ahmed Mohamed', role: 'Customer', image: 'assets/home/reviews/review-avatar-1.png' },
    { name: 'Ahmed Mohamed', role: 'Customer', image: 'assets/home/reviews/review-avatar-2.png' },
    { name: 'Ahmed Mohamed', role: 'Customer', image: 'assets/home/reviews/review-avatar-3.png' },
    { name: 'Ahmed Mohamed', role: 'Customer', image: 'assets/home/reviews/review-avatar-4.png' }
  ];

  trustedCompanies = [1, 2, 3, 4, 5, 6];

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  showPreviousBanner() {
    this.currentBanner--;

    if (this.currentBanner < 0) {
      this.currentBanner = this.heroBanners.length - 1;
    }
  }

  showNextBanner() {
    this.currentBanner++;

    if (this.currentBanner === this.heroBanners.length) {
      this.currentBanner = 0;
    }
  }

  showBanner(index: number) {
    this.currentBanner = index;
  }

  getPremiumProducts() {
    const allProducts = this.products();

    if (allProducts.length === 0) {
      return [];
    }

    return [
      allProducts[this.premiumStart],
      allProducts[(this.premiumStart + 1) % allProducts.length],
      allProducts[(this.premiumStart + 2) % allProducts.length]
    ];
  }

  showPreviousProducts() {
    this.premiumStart--;

    if (this.premiumStart < 0) {
      this.premiumStart = this.products().length - 1;
    }
  }

  showNextProducts() {
    this.premiumStart++;

    if (this.premiumStart === this.products().length) {
      this.premiumStart = 0;
    }
  }

  getReviews() {
    return this.reviews.map((_, index) =>
      this.reviews[(this.reviewStart + index) % this.reviews.length]
    );
  }

  showPreviousReviews() {
    this.reviewStart--;

    if (this.reviewStart < 0) {
      this.reviewStart = this.reviews.length - 1;
    }
  }

  showNextReviews() {
    this.reviewStart++;

    if (this.reviewStart === this.reviews.length) {
      this.reviewStart = 0;
    }
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.categories.set(response.categories.slice(0, 5)),
      error: () => this.errorMessage.set('Could not load the home page data.')
    });
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Could not load the home page data.');
      }
    });
  }
}
