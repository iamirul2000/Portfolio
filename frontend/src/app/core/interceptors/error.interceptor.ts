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
          // Unauthorized - redirect to login
          router.navigate(['/admin/login']);
          errorMessage = 'Unauthorized. Please login.';
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
