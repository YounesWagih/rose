import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductFilters, ProductsResponse } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://flower.elevateegy.com/api/v1/products';

  getProducts(filters: ProductFilters = {}) {
    let params = new HttpParams();

    if (filters.keyword?.trim()) {
      params = params.set('keyword', filters.keyword.trim());
    }

    filters.categories?.forEach((category) => {
      params = params.append('category', category);
    });

    if (filters.occasion) {
      params = params.set('occasion', filters.occasion);
    }

    if (filters.minPrice !== undefined) {
      params = params.set('price[gte]', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      params = params.set('price[lte]', filters.maxPrice);
    }

    if (filters.minimumRating) {
      params = params.set('rateAvg[gte]', filters.minimumRating);
    }

    if (filters.stock === 'in') {
      params = params.set('quantity[gt]', 0);
    } else if (filters.stock === 'out') {
      params = params.set('quantity[lte]', 0);
    }

    if (filters.onSale) {
      params = params.set('discount[gt]', 0);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    params = params.set('limit', filters.limit ?? 50);

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }
}
