import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tokenGetter } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${tokenGetter()}`,
      },
    });
    return next.handle(req).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (err.status === 401) {
          this.router.navigate(['/auth/login'])
        }
        return throwError(err)
      }
      ));
  }
}
