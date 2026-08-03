import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ProductDetailsResponse,
  ProductFilters,
  ProductsResponse,
  RelatedProductsResponse
} from '../../shared/models/product.model';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/products`;

  getProducts(filters: ProductFilters = {}) {
    let params = new HttpParams();

    if (filters.keyword?.trim()) {
      params = params.set('keyword', filters.keyword.trim());
    }

    filters.categories?.forEach((category) => {
      params = params.append('category', category);
    });

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

    params = params.set('limit', filters.limit ?? 50);

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

  getProductById(id: string) {
    return this.http.get<ProductDetailsResponse>(`${this.apiUrl}/${id}`);
  }

  getRelatedProducts(productId: string) {
    return this.http.get<RelatedProductsResponse>(
      `${API_BASE_URL}/related/category/${productId}`
    );
  }
}
