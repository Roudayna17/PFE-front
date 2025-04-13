import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from './house';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  createHouse(houseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/house/create-house`, houseData);
  }

  getHouseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/house/detail-house/${id}`);
  }

  updateHouse(id: number, houseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/house/update-house/${id}`, houseData);
  }

  deleteHouse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/house/delete-house/${id}`);
  }
  addPicture( picture:any):Observable<any>
  {
    return this.http.post<any>(this.apiUrl+'/pictures/add-picture',picture) as Observable <any>
  }
  deleteMultiple(ids: number[]): Observable<any> {
  console.log("IDs envoyés pour suppression :", ids);
  return this.http.post(`${this.apiUrl}/house/delete-multiple`, { ids })
}
  

  getAllHouses(): Observable<House[]> {
    return this.http.get<House[]>(`${this.apiUrl}/house/list-house`);
  }
 
  
}

