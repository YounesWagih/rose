import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoriesResponse } from '../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://flower.elevateegy.com/api/v1/categories';

  getCategories() {
    return this.http.get<CategoriesResponse>(this.apiUrl);
  }
}
