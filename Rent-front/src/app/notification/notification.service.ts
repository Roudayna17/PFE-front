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
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/feedback';
  private feedbackCount = new BehaviorSubject<number>(0);
  private unreadFeedbacks: Feedback[] = [];

  constructor(private http: HttpClient) { 
    this.loadInitialCount();
  }

  private loadInitialCount(): void {
    this.http.get<Feedback[]>(`${this.apiUrl}?read=false`).subscribe({
      next: (feedbacks) => {
        this.unreadFeedbacks = feedbacks;
        this.feedbackCount.next(feedbacks.length);
      },
      error: (err) => console.error('Error loading feedback count', err)
    });
  }

  markAsRead(id: number): Observable<Feedback> {
    return this.http.patch<Feedback>(`${this.apiUrl}/${id}`, { read: true }).pipe(
      tap((updatedFeedback) => {
        // Mettre à jour la liste des feedbacks non lus
        this.unreadFeedbacks = this.unreadFeedbacks.filter(fb => fb.id !== id);
        this.feedbackCount.next(this.unreadFeedbacks.length);
      })
    );
  }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  getUnreadFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}?read=false`);
  }

  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Vérifier si le feedback supprimé était non lu
        if (this.unreadFeedbacks.some(fb => fb.id === id)) {
          this.unreadFeedbacks = this.unreadFeedbacks.filter(fb => fb.id !== id);
          this.feedbackCount.next(this.unreadFeedbacks.length);
        }
      })
    );
  }

  getFeedbackCount(): Observable<number> {
    return this.feedbackCount.asObservable();
  }
}