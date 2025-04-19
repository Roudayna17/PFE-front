import { Injectable } from '@angular/core';
import { Login, User } from './auth';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private apiUrl = 'http://localhost:3000';
   private currentUserSubject = new BehaviorSubject<User | null>(null);


   constructor(private http: HttpClient, private router: Router) {
    // Initialize with user from localStorage if exists
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  loginUser(login:Login): Observable<any> {
    console.log("Données envoyées au backend:", login);

    return this.http.post<any>(this.apiUrl+'/auth/login-user',login)as Observable<[User[]]>;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, {
      email,
      token,
      newPassword
    });
  }}

export function tokenGetter(platformId: object): string {
  if (!isPlatformBrowser(platformId)) {
    console.warn("tokenGetter: Running in a non-browser environment.");
    return "";
  }
  const cookies = document.cookie.split(";").map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}
 

  

