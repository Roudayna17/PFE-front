import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationService } from './reservation.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading = true;
  currentFilter = 'all';

  // Calcul des totaux sur la liste des réservations
  get acceptedCount(): number {
    return this.reservations.filter(r => r.status && !r.isRejected).length;
  }

  get rejectedCount(): number {
    return this.reservations.filter(r => r.isRejected).length;
  }

  get pendingCount(): number {
    return this.reservations.filter(r => !r.status && !r.isRejected).length;
  }

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.filteredReservations = [...reservations];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        this.isLoading = false;
      }
    });
  }

  filterReservations(filter: string): void {
    this.currentFilter = filter;
    switch (filter) {
      case 'all':
        this.filteredReservations = [...this.reservations];
        break;
      case 'pending':
        this.filteredReservations = this.reservations.filter(r => !r.status && !r.isRejected);
        break;
      case 'accepted':
        this.filteredReservations = this.reservations.filter(r => r.status && !r.isRejected);
        break;
      case 'rejected':
        this.filteredReservations = this.reservations.filter(r => r.isRejected);
        break;
      default:
        this.filteredReservations = [...this.reservations];
    }
  }
}
