import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from './offre';



@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:3000/offre';

  constructor(private http: HttpClient) {}

  /** Récupérer toutes les offres */
  getOffres(): Observable<any> {
    return this.http.get<Offre[]>(`${this.apiUrl}/list-offre`, );
  }

  /** Ajouter une nouvelle offre */
  addOffre(offre: any): Observable<Offre> {
    return this.http.post<Offre>(`${this.apiUrl}/create-offre`, offre);
  }

 /** Mettre à jour une offre existante */
updateOffre(id: number, offre: Offre): Observable<Offre> {
  return this.http.patch<Offre>(`${this.apiUrl}/update-offre/${id}`, offre);
}


  /** Supprimer une offre */
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-offre/${id}`);
  }
  deleteMultiple(ids: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-multiple`, { ids });
  }
  /** Récupérer une offre par son ID */
  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/detail-offre/${id}`);
  }
}