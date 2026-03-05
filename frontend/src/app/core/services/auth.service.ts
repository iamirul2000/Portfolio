import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check authentication status on service initialization
    this.checkAuth().subscribe();
  }

  login(email: string, password: string): Observable<{ data: { user: User } }> {
    // First get CSRF cookie, then perform login
    return new Observable(observer => {
      this.http.get(`${environment.apiUrl.replace('/api/v1', '')}/sanctum/csrf-cookie`, {
        withCredentials: true
      }).subscribe({
        next: () => {
          // After CSRF cookie is set, perform login
          this.http.post<{ data: { user: User } }>(
            `${environment.apiUrl}/auth/login`,
            { email, password }
          ).subscribe({
            next: (response) => {
              this.currentUserSubject.next(response.data.user);
              this.isAuthenticatedSubject.next(true);
              observer.next(response);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/admin/login']);
      })
    );
  }

  checkAuth(): Observable<User | null> {
    return this.http.get<{ data: User }>(`${environment.apiUrl}/auth/me`).pipe(
      map(response => {
        this.currentUserSubject.next(response.data);
        this.isAuthenticatedSubject.next(true);
        return response.data;
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
