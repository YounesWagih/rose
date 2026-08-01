import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_API_BASE_URL } from './auth.service';
import { AuthStorageService } from './auth-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthStorageService).getToken();

  if (!token || !request.url.startsWith(AUTH_API_BASE_URL)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  );
};
