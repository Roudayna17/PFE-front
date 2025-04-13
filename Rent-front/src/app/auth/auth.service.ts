import { Injectable } from '@angular/core';
import { Login, User } from './auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
  getUserEmail(): string {
    throw new Error('Method not implemented.');
  }
 
  private apiUrl = 'http://localhost:3000';


  constructor(private http:HttpClient,private router: Router) { 

    
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
 

  

