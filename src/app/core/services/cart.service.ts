import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CartResponse } from '../../shared/models/cart.model';
import { AuthService } from '../auth/auth.service';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = `${API_BASE_URL}/cart`;
  private readonly totalUnits = signal(0);

  readonly count = computed(() => this.totalUnits());
  readonly isUpdating = signal(false);

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.load();
      } else {
        this.totalUnits.set(0);
        this.isUpdating.set(false);
      }
    });
  }

  add(productId: string, quantity = 1): void {
    const userId = this.auth.user()?._id;

    if (!userId || quantity < 1 || this.isUpdating()) {
      return;
    }

    this.isUpdating.set(true);

    this.http
      .post(this.apiUrl, { product: productId, quantity })
      .pipe(
        finalize(() => {
          this.isUpdating.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.totalUnits.update((total) => total + quantity);
        },
        error: () => undefined,
      });
  }

  private load(): void {
    const userId = this.auth.user()?._id;

    if (!userId) {
      return;
    }

    this.isUpdating.set(true);

    this.http
      .get<CartResponse>(this.apiUrl)
      .pipe(
        finalize(() => {
          this.isUpdating.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const total = response.cart.cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          this.totalUnits.set(total);
        },
        error: () => {
          this.totalUnits.set(0);
        },
      });
  }
}
