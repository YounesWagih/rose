import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  merge,
  startWith,
  Subject
} from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product, ProductFilters } from '../../../../shared/models/product.model';
import { hasProductDiscount } from '../../../../shared/utils/product-price.util';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

type SaleFilter = 'sale' | 'stock' | 'out' | 'discount';

@Component({
  selector: 'app-category',
  imports: [ProductCardComponent, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  filtersOpen = signal(false);

  searchControl = new FormControl('', { nonNullable: true });
  priceControl = new FormControl(5000, { nonNullable: true });
  selectedCategories = new Set<string>();
  selectedSales = new Set<SaleFilter>();
  minimumRating = 0;
  priceLimit = 5000;
  currentPage = 1;
  productsPerPage = 15;

  brands = ['Tovola', 'Sundoy', 'Sahoo Gifts', 'Casterly', 'Mainden Gifts'];
  colors = ['#5d6ee1', '#46b45e', '#20a0b5', '#ffb714', '#f04438'];
  sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
  ratings = [5, 4, 3, 2, 1];
  stars = [1, 2, 3, 4, 5];
  saleFilters = [
    { value: 'sale', label: 'On Sale' },
    { value: 'stock', label: 'In Stock' },
    { value: 'out', label: 'Out Of Stock' },
    { value: 'discount', label: 'Discount' }
  ] as const;

  private filtersChanged = new Subject<void>();
  private priceLimitLoaded = false;

  ngOnInit() {
    const categoryId = this.route.snapshot.queryParamMap.get('category');
    if (categoryId) this.selectedCategories.add(categoryId);

    this.loadCategories();

    merge(
      this.searchControl.valueChanges.pipe(distinctUntilChanged()),
      this.priceControl.valueChanges.pipe(distinctUntilChanged()),
      this.filtersChanged
    )
      .pipe(
        startWith(''),
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadProducts());
  }

  getFilteredProducts() {
    return this.products().filter((product) => {
      const needsValidDiscount = this.selectedSales.has('discount');
      return !needsValidDiscount || hasProductDiscount(product);
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

  getSaleCount(filter: SaleFilter) {
    return this.products().filter((product) => this.matchesSaleFilter(product, filter)).length;
  }

  toggleCategory(categoryId: string) {
    this.toggleSetValue(this.selectedCategories, categoryId);
    this.applyFilters();
  }

  toggleSale(filter: SaleFilter) {
    this.toggleSetValue(this.selectedSales, filter);
    this.applyFilters();
  }

  setRating(rating: number) {
    this.minimumRating = this.minimumRating === rating ? 0 : rating;
    this.applyFilters();
  }

  applyFilters() {
    this.filtersChanged.next();
  }

  toggleFilters() {
    this.filtersOpen.update((open) => !open);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  private toggleSetValue<T>(values: Set<T>, value: T) {
    values.has(value) ? values.delete(value) : values.add(value);
  }

  private matchesSaleFilter(product: Product, filter: SaleFilter) {
    if (filter === 'sale') return product.discount > 0;
    if (filter === 'stock') return product.quantity > 0;
    if (filter === 'out') return product.quantity <= 0;
    return hasProductDiscount(product);
  }

  private getApiFilters(): ProductFilters {
    const wantsInStock = this.selectedSales.has('stock');
    const wantsOutOfStock = this.selectedSales.has('out');
    let stock: ProductFilters['stock'];

    if (wantsInStock !== wantsOutOfStock) {  // both true = nothing   (like XOR ^_^ )
      stock = wantsInStock ? 'in' : 'out';
    }

    return {
      keyword: this.searchControl.value,
      categories: [...this.selectedCategories],
      maxPrice: this.priceControl.value,
      minimumRating: this.minimumRating,
      stock,
      onSale: this.selectedSales.has('sale') || this.selectedSales.has('discount')
    };
  }

  private setInitialPriceLimit(products: Product[]) {
    if (this.priceLimitLoaded) return;

    const prices = products.map((product) => product.price);
    this.priceLimit = Math.ceil(Math.max(...prices, 1));
    this.priceControl.setValue(this.priceLimit, { emitEvent: false });
    this.priceLimitLoaded = true;
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.currentPage = 1;

    this.productService.getProducts(this.getApiFilters()).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.setInitialPriceLimit(response.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.errorMessage.set('Could not load products.');
        this.isLoading.set(false);
      }
    });
  }

  private loadCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.categories.set(response.categories),
        error: () => this.errorMessage.set('Could not load categories.')
      });
  }
}
