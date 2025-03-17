import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Locataire } from './locataire';
@Injectable({
  providedIn: 'root'
})
export class  LocataireService{
  getLocataireList() {
    throw new Error('Method not implemented.');
  }
constructor(private http:HttpClient) { }
urlApi:string='http://localhost:3000'

create(clientData:any) : Observable<any>
{
return this.http.post<Locataire>(this.urlApi+'/Client/create-client',clientData) as Observable<any>
}
listClient():Observable<any>
{
return this.http.get(this.urlApi+'/Client/list-clients') as Observable<any>
}

getClientById(id:number) : Observable<Locataire>
{
 return  this.http.get(this.urlApi+"/Client/"+JSON.stringify(id)) as Observable<Locataire> 
}
updateClient(id:number,dataClient:Locataire) :Observable<Locataire>{
  return this.http.patch(this.urlApi+"/Client/update-client/"+JSON.stringify(id),dataClient) as Observable<Locataire>
}
DeleteClient(id:number): Observable<any>{
  return this.http.delete(this.urlApi+"/Client/delete-client/"+JSON.stringify(id))
 }
 DeleteMultiple(locataireList:any):Observable<any>
 {
  console.log("liste delete",locataireList) 
  return this.http.post(this.urlApi+'/Client/delete-multiple-clients',locataireList) as Observable<any>}

}