import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          // Only redirect to login if we're trying to access a protected route
          // Don't redirect if it's just the auth check or we're already on a public page
          const currentUrl = router.url;
          const isAdminRoute = currentUrl.startsWith('/admin') && !currentUrl.startsWith('/admin/login');
          
          if (isAdminRoute) {
            router.navigate(['/admin/login']);
          }
          
          errorMessage = 'Unauthorized. Please login.';
          
          // Don't log 401 errors from auth check endpoint (expected when not logged in)
          if (req.url.includes('/auth/me')) {
            return throwError(() => ({ message: errorMessage, error }));
          }
        } else if (error.status === 403) {
          errorMessage = 'Access forbidden';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 422) {
          // Validation error
          errorMessage = error.error?.error?.message || 'Validation failed';
        } else if (error.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.error?.error?.message || `Error: ${error.status}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);
      return throwError(() => ({ message: errorMessage, error }));
    })
  );
};
