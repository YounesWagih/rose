import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from './auth.models';
import { AuthStorageService } from './auth-storage.service';
import { AUTH_API_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(AuthStorageService);
  private readonly session = signal<AuthResponse | null>(this.storage.read());
  
  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(credentials: LoginRequest, remember: boolean) {
    return this.http
      .post<AuthResponse>(`${AUTH_API_URL}/signin`, credentials)
      .pipe(
        tap((response) => {
          this.storage.save(response, remember);
          this.session.set(response);
        })
      );
  }

  logout(): void {
    this.http
      .get(`${AUTH_API_URL}/logout`)
      .pipe(finalize(() => this.clearSession()))
      .subscribe({ error: () => undefined });
  }

  private clearSession(): void {
    this.storage.clear();
    this.session.set(null);
  }
}
