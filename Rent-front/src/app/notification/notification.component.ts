// src/app/notification/notification.component.ts

import { Component, OnInit } from '@angular/core';
import { NotificationService, Feedback } from './notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  feedbacks: Feedback[] = [];
  errorMessage = '';


  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.notificationService.getFeedbacks().subscribe(data => {
      this.feedbacks = data;
    });
  }

  async deleteFeedback(id: number) {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      this.notificationService.deleteFeedback(id).subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(f => f.id !== id);
          Swal.fire(
            'Supprimé!',
            'Le feedback a été supprimé.',
            'success'
          );
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression';
          console.error(err);
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression.',
            'error'
          );
        }
      });
    }
  }
  respond(feedback: Feedback) {
    const reply = prompt(`Réponse pour ${feedback.email}:`);
    if (reply) {
      this.notificationService.respondToFeedback(feedback.email || '', reply);
      alert('Réponse envoyée !');
    }
  }
}
