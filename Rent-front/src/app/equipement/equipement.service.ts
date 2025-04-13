import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from './equipement';

@Injectable({
  providedIn: 'root',
})
export class EquipementService {
 
  private apiUrl = 'http://localhost:3000/equipment';

  constructor(private http: HttpClient) {}

  addEquipement(equipement: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-equipment`, equipement);
  }

  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/detail-equipment/${id}`);
  }

  updateEquipement(id: number, equipement: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-equipment/${id}`, equipement);
  }
  getEquipements(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(`${this.apiUrl}/list-equipment`);
  }
  
 
  deleteMultiple(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-multiple`, { ids });
  }
  deleteSingle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  deleteEquipement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-equipment/${id}`);
  }
}