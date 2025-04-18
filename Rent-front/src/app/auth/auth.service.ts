import { Injectable } from '@angular/core';
import { Login, User } from './auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private apiUrl = 'http://localhost:3000';


  constructor(private http:HttpClient,private router: Router) {}
  get currentUser(): User | null {
    // Si vous stockez le user dans localStorage après le login
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  loginUser(login:Login): Observable<any> {
    console.log("Données envoyées au backend:", login);

    return this.http.post<any>(this.apiUrl+'/auth/login-user',login)as Observable<[User[]]>;
  }
  // Fonction de déconnexion
  logout(): void {
    localStorage.removeItem('token'); // Supprime le token
    this.router.navigate(['/auth/login']); // Redirige vers la page de connexion
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Nouvelle méthode pour demander une réinitialisation
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  // Nouvelle méthode pour soumettre un nouveau mot de passe
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, {
      email,
      token,
      newPassword
    });
  }
}

export function tokenGetter(platformId: object): string {
  if (!isPlatformBrowser(platformId)) {
    console.warn("tokenGetter: Running in a non-browser environment.");
    return "";
  }
  const cookies = document.cookie.split(";").map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}
 

  

