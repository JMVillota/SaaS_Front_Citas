import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

interface LoginResponse {
  access_token: string;
  expires_at: string;
}

interface User {
  email: string;
  token: string;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl: string;
  private tokenExpirationTimer: any;

  private logoutEvent = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.apiUrl = environment.apiUrl;
    this.initializeTokenExpirationTimer();
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      user.expiresAt = new Date(user.expiresAt);
      return user;
    }
    return null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          const user: User = { 
            email, 
            token: response.access_token, 
            expiresAt: new Date(response.expires_at)
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.initializeTokenExpirationTimer();
          return user;
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.logoutEvent.next(true);
    this.router.navigate(['/auth/login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  onLogout(): Observable<boolean> {
    return this.logoutEvent.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  public initializeTokenExpirationTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    const user = this.currentUserValue;
    if (user && user.expiresAt) {
      const expiresAt = new Date(user.expiresAt).getTime();
      const now = new Date().getTime();
      const timeUntilExpiration = expiresAt - now;

      if (timeUntilExpiration > 0) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, timeUntilExpiration);
      } else {
        this.logout();
      }
    }
  }

  refreshToken(): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh-token`, {})
      .pipe(
        map(response => {
          const user = this.currentUserValue;
          if (user) {
            user.token = response.access_token;
            user.expiresAt = new Date(response.expires_at);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.initializeTokenExpirationTimer();
          }
          return user as User;
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
}