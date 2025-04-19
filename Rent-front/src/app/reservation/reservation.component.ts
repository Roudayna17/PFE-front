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
  currentUserId: number | null = null;
  rejectionMessage: string = '';
  selectedReservationId: number | null = null;

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
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    if (this.authService.currentUser$) {
      this.authService.currentUser$.subscribe((user: any) => {
        this.currentUserId = user?.id || null;
        this.loadReservations();
      });
    }
  }

  loadReservations(): void {
    this.isLoading = true;
    
    if (this.currentUserId) {
      this.reservationService.getReservationsByUser(this.currentUserId).subscribe({
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
    } else {
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
  }

  canManageReservation(reservation: Reservation): boolean {
    return reservation.offre?.house?.user?.id !== undefined;
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

  acceptReservation(id: number): void {
    this.reservationService.acceptReservation(id).subscribe({
      next: (updatedReservation) => {
        this.updateReservationInList(updatedReservation);
      },
      error: (err) => {
        console.error('Erreur lors de l\'acceptation de la réservation:', err);
      }
    });
  }

  prepareReject(reservationId: number): void {
    this.selectedReservationId = reservationId;
    this.rejectionMessage = '';
  }

  rejectReservation(): void {
    if (!this.selectedReservationId) return;
    
    this.reservationService.rejectReservation(this.selectedReservationId, this.rejectionMessage).subscribe({
      next: (updatedReservation) => {
        this.updateReservationInList(updatedReservation);
        this.selectedReservationId = null;
        this.rejectionMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors du rejet de la réservation:', err);
      }
    });
  }

  cancelReject(): void {
    this.selectedReservationId = null;
    this.rejectionMessage = '';
  }

  private updateReservationInList(updatedReservation: Reservation): void {
    const index = this.reservations.findIndex(r => r.id === updatedReservation.id);
    if (index !== -1) {
      this.reservations[index] = updatedReservation;
      this.filterReservations(this.currentFilter);
    }
  }
}