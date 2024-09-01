import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/login/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && this.authService.currentUserValue) {
          // Token expirado, intenta refrescarlo
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Reintenta la solicitud original con el nuevo token
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.currentUserValue?.token}`
                }
              });
              return next.handle(newRequest);
            }),
            catchError(refreshError => {
              // Si el refresh falla, cierra la sesión
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}