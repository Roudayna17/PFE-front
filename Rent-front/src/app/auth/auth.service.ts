import { Injectable } from '@angular/core';
import { Login, User } from './auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
 
  private apiUrl = 'http://localhost:3000/';


  constructor(private http:HttpClient) { 

    
  }

  
  loginUser(login:Login): Observable<any> {
    return this.http.post<any>(this.apiUrl+'auth/login-user',login)as Observable<[User[]]>;
  }

}
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
export function tokenGetter(platformId: object): string {
  if (!isPlatformBrowser(platformId)) {
    console.warn("tokenGetter: Running in a non-browser environment.");
    return "";
  }
  const cookies = document.cookie.split(";").map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}
 

  

