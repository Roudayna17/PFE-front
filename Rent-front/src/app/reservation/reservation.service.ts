import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface House {
  id: number;
  name: string;
  user: {
    id: number;
  };
}

export interface Offre {
  id: number;
  title: string;
  description: string;
  location: string;
  priceTTC: number;
  availability: string;
  house: House;
}

export interface Reservation {
  id: number;
  client?: Client;
  offre?: Offre;
  createdAt: Date;
  status: boolean;
  isRead: boolean;
  decisionDate?: Date;
  decisionMessage?: string;
  isRejected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/statistics`);
  }
  
}
