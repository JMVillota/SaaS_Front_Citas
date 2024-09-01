import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Interceptor called');
    console.log('API Key:', environment.apiKey);
    
    const apiReq = request.clone({
      setHeaders: {
        'x-api-key': environment.apiKey
      }
    });
    
    console.log('Modified request:', apiReq);
    
    return next.handle(apiReq);
  }
}