import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthStorageService } from './auth-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthStorageService).getToken();

  if (!token || !request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  );
};
