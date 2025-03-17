import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caracteristique } from './caracteristique';

@Injectable({
  providedIn: 'root'
})
export class CaracteristiqueService {
  baseUrl: string = 'http://localhost:3000/characteristic';
  private apiUrl = `${this.baseUrl}/list-Characteristic`;

  constructor(private http: HttpClient) {}

  getCharacteristics(): Observable<Caracteristique[]> {
    return this.http.get<Caracteristique[]>(this.apiUrl);
  }

  getCharacteristicById(id: number): Observable<Caracteristique> {
    return this.http.get<Caracteristique>(`${this.baseUrl}/detail-Characteristic/${id}`);
  }

  addCharacteristics(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-characteristic`, data);
  }

  updateCharacteristic(id: number, data: FormData): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/update-Characteristic/${id}`, data);
  }

  deleteCharacteristic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-characteristic${id}`);
  }
}
