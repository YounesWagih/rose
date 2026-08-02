import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  merge,
  of,
  startWith,
  Subject,
  Subscription,
  switchMap
} from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Category } from '../../shared/models/category.model';
import { Product, ProductFilters } from '../../shared/models/product.model';

@Component({
  selector: 'app-category',
  imports: [FormsModule, ProductCardComponent, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  searchControl = new FormControl('', { nonNullable: true });
  selectedCategories = new Set<string>();
  selectedSales = new Set<string>();
  minimumRating = 0;
  maxPrice = 5000;
  priceLimit = 5000;
  currentPage = 1;
  productsPerPage = 15;

  brands = ['Tovola', 'Sundoy', 'Sahoo Gifts', 'Casterly', 'Mainden Gifts'];
  colors = ['#5d6ee1', '#46b45e', '#20a0b5', '#ffb714', '#f04438'];
  sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
  ratings = [5, 4, 3, 2, 1];
  stars = [1, 2, 3, 4, 5];

  private filtersChanged = new Subject<void>();
  private productsSubscription?: Subscription;
  private priceLimitLoaded = false;

  ngOnInit() {
    this.loadCategories();

    this.productsSubscription = merge(
      this.searchControl.valueChanges.pipe(distinctUntilChanged()),
      this.filtersChanged
    )
      .pipe(
        startWith(''),
        debounceTime(300),
        switchMap(() => {
          this.isLoading.set(true);
          this.errorMessage.set('');
          this.resetPage();

          return this.productService.getProducts(this.getApiFilters()).pipe(
            catchError(() => {
              this.errorMessage.set('Could not load products.');
              return of({ products: [] });
            })
          );
        })
      )
      .subscribe((response) => {
        this.products.set(response.products);
        this.setInitialPriceLimit(response.products);
        this.isLoading.set(false);
      });
  }

  ngOnDestroy() {
    this.productsSubscription?.unsubscribe();
  }

  getFilteredProducts() {
    return this.products().filter((product) => {
      const needsValidDiscount = this.selectedSales.has('discount');
      return !needsValidDiscount || this.hasValidDiscount(product);
    });
  }

  getPageProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.getFilteredProducts().slice(start, start + this.productsPerPage);
  }

  getPageNumbers() {
    return Array.from({ length: this.getTotalPages() }, (_, index) => index + 1);
  }

  getTotalPages() {
    return Math.ceil(this.getFilteredProducts().length / this.productsPerPage);
  }

  getSaleCount(filter: string) {
    return this.products().filter((product) => this.matchesSaleFilter(product, filter)).length;
  }

  toggleCategory(categoryId: string) {
    this.toggleSetValue(this.selectedCategories, categoryId);
    this.applyFilters();
  }

  toggleSale(filter: string) {
    this.toggleSetValue(this.selectedSales, filter);
    this.applyFilters();
  }

  setRating(rating: number) {
    this.minimumRating = this.minimumRating === rating ? 0 : rating;
    this.applyFilters();
  }

  applyFilters() {
    this.resetPage();
    this.filtersChanged.next();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  resetPage() {
    this.currentPage = 1;
  }

  private toggleSetValue(values: Set<string>, value: string) {
    values.has(value) ? values.delete(value) : values.add(value);
    this.resetPage();
  }

  private matchesSaleFilter(product: Product, filter: string) {
    if (filter === 'sale') return product.discount > 0;
    if (filter === 'stock') return product.quantity > 0;
    if (filter === 'out') return product.quantity <= 0;
    return this.hasValidDiscount(product);
  }

  private hasValidDiscount(product: Product) {
    return product.discount > 0 &&
      product.priceAfterDiscount > 0 &&
      product.priceAfterDiscount < product.price;
  }

  private getApiFilters(): ProductFilters {
    const wantsInStock = this.selectedSales.has('stock');
    const wantsOutOfStock = this.selectedSales.has('out');
    let stock: ProductFilters['stock'];

    if (wantsInStock !== wantsOutOfStock) {
      stock = wantsInStock ? 'in' : 'out';
    }

    return {
      keyword: this.searchControl.value,
      categories: [...this.selectedCategories],
      maxPrice: this.maxPrice,
      minimumRating: this.minimumRating,
      stock,
      onSale: this.selectedSales.has('sale') || this.selectedSales.has('discount'),
      limit: 50
    };
  }

  private setInitialPriceLimit(products: Product[]) {
    if (this.priceLimitLoaded) return;

    const prices = products.map((product) => product.price);
    this.priceLimit = Math.ceil(Math.max(...prices, 1));
    this.maxPrice = this.priceLimit;
    this.priceLimitLoaded = true;
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.categories.set(response.categories),
      error: () => this.errorMessage.set('Could not load categories.')
    });
  }
}
