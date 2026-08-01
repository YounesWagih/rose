import { Injectable } from '@angular/core';
import { AuthResponse } from './auth.models';

const AUTH_SESSION_KEY = 'rose.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  read(): AuthResponse | null {
    const session =
      localStorage.getItem(AUTH_SESSION_KEY) ??
      sessionStorage.getItem(AUTH_SESSION_KEY);

    return session ? JSON.parse(session) : null;
  }

  save(session: AuthResponse, remember: boolean): void {
    this.clear();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  clear(): void {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  getToken(): string | null {
    return this.read()?.token ?? null;
  }
}
