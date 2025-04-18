import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    global: {},
    houses: {},
    offers: {},
    lessors: {},
    clients: {},
    reservations: {}
  };
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }
loadData(): void {
  this.loading = true;
  
  this.dashboardService.getAllStats().subscribe({
    next: (data) => {
      this.stats = {
        global: {
          houses: data.global?.totalHouses || 0,
          offers: data.global?.totalOffers || 0,
          lessors: data.global?.totalLessors || 0,
          clients: data.global?.totalClients || 0,
          reservations: data.global?.totalReservations || 0
        },
        houses: {
          houseTypeStats: data.houses?.houseTypeStats || [],
          recentHouses: data.houses?.recentHouses || []
        },
        offers: {
          priceStats: data.offers?.priceStats || {},
          monthlyTrends: data.offers?.monthlyTrends || [],
          lastOffer: data.offers?.lastOffer,
          mostCommentedOffer: data.offers?.mostCommentedOffer,
          mostReservedOffer: data.offers?.mostReservedOffer,
          popularOffers: data.offers?.topHouses || []
        },
        lessors: {
          topLessors: data.lessors?.topLessors || [],
          topLessorByHouses: data.lessors?.topLessorByHouses,
          topLessorByOffers: data.lessors?.topLessorByOffers,
          lastLessorWithOffer: data.lessors?.lastLessorWithOffer,
          lessorGrowth: data.lessors?.lessorGrowth || []
        },
        clients: {
          registrationTrends: data.clients?.registrationTrends || [],
          activityMetrics: data.clients?.activityMetrics || {},
          topClients: data.clients?.topClients || []
        },
        reservations: {
          statusStats: data.reservations?.statusDistribution || [],
          monthlyTrends: data.reservations?.monthlyTrends || [],
          avgResponseTime: data.reservations?.averageResponseTime || 0,
          acceptanceRate: data.reservations?.acceptanceRate || 0,
          recentReservations: data.reservations?.recentReservations || []
        }
      };
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading dashboard data:', err);
      this.loading = false;
    }
  });
}

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  formatMonth(monthString: string): string {
    if (!monthString) return '';
    const date = new Date(monthString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  formatCurrency(amount: number): string {
    if (isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(amount);
  }
  
}