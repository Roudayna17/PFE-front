import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from './equipement';

@Injectable({
  providedIn: 'root',
})
export class EquipementService {
  getCharacteristicById(id: number) {
    throw new Error('Method not implemented.');
  }
 
 
  private apiUrl = 'http://localhost:3000/equipement';

  constructor(private http: HttpClient) {}

  addEquipement(equipement: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-equipement`, equipement);
  }

  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/detail-equipement/${id}`);
  }

  updateEquipement(id: number, equipement: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-equipement/${id}`, equipement);
  }
  getEquipements(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(`${this.apiUrl}/list-equipement`);
  }
 
  deleteMultiple(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-multiple`, { ids });
  }
  deleteSingle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  deleteEquipement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-equipement/${id}`);
  }
}