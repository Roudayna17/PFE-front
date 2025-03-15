import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Offre {
  id?: number;
  title: string;
  description: string;
  houseId: number;
  price: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:3000/offre';

  constructor(private http: HttpClient) {}

  /** Récupérer toutes les offres */
  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }

  /** Ajouter une nouvelle offre */
  addOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(this.apiUrl, offre);
  }

  /** Mettre à jour une offre existante */
  updateOffre(id: number, offre: Offre): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/${id}`, offre);
  }

  /** Supprimer une offre */
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Récupérer une offre par son ID */
  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/${id}`);
  }
}