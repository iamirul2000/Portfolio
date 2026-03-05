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

  login(email: string, password: string): Observable<{ data: { user: User; token: string } }> {
    return this.http.post<{ data: { user: User; token: string } }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        this.currentUserSubject.next(response.data.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
      }),
      catchError(() => {
        // Even if logout fails, clear local state
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }

  checkAuth(): Observable<User | null> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      return of(null);
    }

    return this.http.get<{ data: User }>(`${environment.apiUrl}/auth/me`).pipe(
      map(response => {
        this.currentUserSubject.next(response.data);
        this.isAuthenticatedSubject.next(true);
        return response.data;
      }),
      catchError(() => {
        localStorage.removeItem('auth_token');
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
