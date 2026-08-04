import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { WishlistResponse } from '../../shared/models/wishlist.model';
import { AuthService } from '../auth/auth.service';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = `${API_BASE_URL}/wishlist`;
  private readonly productIds = signal<string[]>([]);

  readonly count = computed(() => this.productIds().length);
  readonly isUpdating = signal(false);

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.load();
      } else {
        this.productIds.set([]);
        this.isUpdating.set(false);
      }
    });
  }

  isInWishlist(productId: string): boolean {
    return this.productIds().includes(productId);
  }

  toggle(productId: string): void {
    if (!this.auth.isAuthenticated() || this.isUpdating()) {
      return;
    }

    const shouldRemove = this.isInWishlist(productId);
    const request = shouldRemove
      ? this.http.delete(`${this.apiUrl}/${productId}`)
      : this.http.post(this.apiUrl, { productId });

    this.isUpdating.set(true);

    request.pipe(finalize(() => this.isUpdating.set(false))).subscribe({
      next: () => {
        this.productIds.update((ids) =>
          shouldRemove
            ? ids.filter((id) => id !== productId)
            : [...new Set([...ids, productId])],
        );
      },
      error: () => undefined,
    });
  }

  private load(): void {
    this.isUpdating.set(true);

    this.http
      .get<WishlistResponse>(this.apiUrl)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: (response) => {
          const ids = response.wishlist.products.map((product) => product._id);
          this.productIds.set([...new Set(ids)]);
        },
        error: () => this.productIds.set([]),
      });
  }
}
