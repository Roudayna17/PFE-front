import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  findUserById(id: number) {
    throw new Error('Method not implemented.');
  }
  getUserList() {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }
   
urlApi:string='http://localhost:3000'
 create(userData:User) : Observable<User>
 {
  return this.http.post<User>(this.urlApi+'/user/create-user',userData) as Observable<User>
}
listUser():Observable<any>
{
  return this.http.get(this.urlApi+'/user/list-users') as Observable<any>
}


getUserById(id:number) : Observable<User>
{
 return  this.http.get(this.urlApi+"/user/user/"+JSON.stringify(id)) as Observable<User> 
}
updateUser(id:number,dataUser:User) :Observable<User>{
  return this.http.patch(this.urlApi+"/user/update-user/"+JSON.stringify(id),dataUser) as Observable<User>
}
 DeleteUser(id:number): Observable<any>{
  return this.http.delete(this.urlApi+"/user/delete-user/"+JSON.stringify(id))
 }
 DeleteMultiple(userList:any):Observable<any>
 {
  console.log("liste delete",userList) 
  return this.http.post(this.urlApi+'/user/delete-Multiple-users',userList) as Observable<any>}

}