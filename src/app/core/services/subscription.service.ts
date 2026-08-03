import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/subscriptions/subscribe`;

  subscribe(email: string) {
    return this.http.post<{ message: string }>(this.apiUrl, { email });
  }
}
