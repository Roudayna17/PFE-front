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
export function tokenGetter() {
  var name = "token=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  console.log("token",ca)
  return "";
}
 

  

