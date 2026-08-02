import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://flower.elevateegy.com/api/v1/subscriptions/subscribe';

  subscribe(email: string) {
    return this.http.post<{ message: string }>(this.apiUrl, { email });
  }
}
