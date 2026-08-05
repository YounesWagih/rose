import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/models/product.model';
import { CategoryService } from '../../../category/services/category.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
} from 'ngx-owl-carousel-o';
import {
  adaptCategoryToCard,
  CategoryCard,
} from '../../adapters/category-card.adapter';
import { AboutSectionComponent } from '../../../../shared/components/about-section/about-section.component';
import { BenefitsSectionComponent } from '../../../../shared/components/benefits-section/benefits-section.component';
import { ReviewsSectionComponent } from '../../../../shared/components/reviews-section/reviews-section.component';
import { TrustedSectionComponent } from '../../../../shared/components/trusted-section/trusted-section.component';

@Component({
  selector: 'app-home',
  imports: [
    ProductCardComponent,
    RouterLink,
    CarouselModule,
    AboutSectionComponent,
    BenefitsSectionComponent,
    ReviewsSectionComponent,
    TrustedSectionComponent,
  ],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
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
  popularMobileIndices = [0, 1, 2];

  private readonly prefersReducedMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;

  readonly heroCarouselOptions: OwlOptions = {
    items: 1,
    loop: false,
    rewind: true,
    nav: true,
    navText: [
      '<img src="assets/icons/chevron-left.svg" alt="Previous banner">',
      '<img src="assets/icons/chevron-right.svg" alt="Next banner">',
    ],
    dots: true,
    autoHeight: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    smartSpeed: 600,
    autoplay: !this.prefersReducedMotion,
    autoplayTimeout: 5000,
    autoplaySpeed: 600,
    autoplayHoverPause: true,
  };

  readonly premiumCarouselOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    smartSpeed: 500,
    margin: 24,
    responsive: {
      0: { items: 1 },
      500: { items: 2 },
      900: { items: 3 },
    },
  };

  ngOnInit() {
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

    this.popularMobileIndices = this.popularMobileIndices.map(
      (index, position) => (position === cardIndex ? nextIndex : index),
    );
  }

  isPopularCategoryActive(name: string, isFirst: boolean) {
    const hasGiftsBox = this.categories().some(
      (category) => category.name.trim().toLowerCase() === 'gifts box',
    );

    return (
      name.trim().toLowerCase() === 'gifts box' || (!hasGiftsBox && isFirst)
    );
  }

  pauseAutoplay(carousel: CarouselComponent) {
    carousel.stopAutoplay();
  }

  resumeAutoplay(carousel: CarouselComponent) {
    if (!this.prefersReducedMotion) {
      carousel.startAutoplay();
    }
  }

  private moveIndex(current: number, direction: number, length: number) {
    return length === 0
      ? 0
      : (((current + direction) % length) + length) % length;
  }
}
