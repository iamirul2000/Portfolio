import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Add withCredentials to all requests for Sanctum cookie-based auth
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
