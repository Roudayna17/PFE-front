// src/app/notification/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Feedback {
  id: number;
  message: string;
  type: string;
  rating?: number;
  email?: string;
  read: boolean; // Ajouté
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/feedback'; // change if needed
  private feedbackCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {    this.loadInitialCount();
  }
  private loadInitialCount(): void {
    this.http.get<Feedback[]>(`${this.apiUrl}?read=false`).subscribe({
      next: (feedbacks) => this.feedbackCount.next(feedbacks.length),
      error: (err) => console.error('Error loading feedback count', err)
    });
  }

  markAsRead(id: number): Observable<Feedback> {
    return this.http.patch<Feedback>(`${this.apiUrl}/${id}`, { read: true }).pipe(
      tap(() => {
        // Décrémente le compteur après marquage comme lu
        this.feedbackCount.next(Math.max(0, this.feedbackCount.value - 1));
      })
    );
  }


  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  respondToFeedback(email: string, response: string) {
    // fakka: tna7i l code aw tzido ki t7eb tab3ath email etc.
    console.log(`Responding to ${email}: ${response}`);
  }
   // Méthodes pour le compteur
   getFeedbackCount(): Observable<number> {
    return this.feedbackCount.asObservable();
  }

  
}
