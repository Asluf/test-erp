import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  userId?: string;
  userRole?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3020/auth';
  
  private _isLoggedIn = signal<boolean>(this.hasToken());
  private _currentUser = signal<{ userId: string; userRole: string } | null>(this.getStoredUser());

  isLoggedIn = computed(() => this._isLoggedIn());
  currentUser = computed(() => this._currentUser());

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): { userId: string; userRole: string } | null {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (userId && userRole) {
      return { userId, userRole };
    }
    return null;
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap((response) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId!);
          localStorage.setItem('userRole', response.userRole!);
          this._isLoggedIn.set(true);
          this._currentUser.set({
            userId: response.userId!,
            userRole: response.userRole!
          });
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
