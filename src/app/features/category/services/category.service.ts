import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import { CategoriesResponse, CategoryResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/categories`;

  getCategories() {
    return this.http.get<CategoriesResponse>(this.apiUrl);
  }

  getCategoryById(id: string) {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }
}
