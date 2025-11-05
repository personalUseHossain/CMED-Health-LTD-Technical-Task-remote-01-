import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api'; // Your Spring Boot backend
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Login method - connects to real backend API
   */
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          // Create user object from response
          const user: User = {
            id: credentials.username === 'admin' ? 1 : 2, // Simple mapping
            username: response.username,
            role: response.username === 'admin' ? 'ADMIN' : 'USER'
          };
          
          // Store user details in local storage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Check authentication status with backend
   */
  checkAuth(): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/check`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.username) {
            const user: User = {
              id: response.username === 'admin' ? 1 : 2,
              username: response.username,
              role: response.username === 'admin' ? 'ADMIN' : 'USER'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout method
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          // Still clear local storage even if API call fails
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Check if current user is doctor
   */
  isDoctor(): boolean {
    return this.hasRole('USER'); // Note: In backend, doctors have role 'USER'
  }
}