import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Statistiques globales
  getGlobalStats(): Observable<any> {
    return forkJoin({
      houses: this.http.get<{total: number}>(`${this.apiUrl}/house/analytics/total`).pipe(
        map(res => res.total),
        catchError(() => of(0))
      ),
      offers: this.http.get<any>(`${this.apiUrl}/offre/analytics/stats`).pipe(
        map(res => res.totalOffers || 0), // Cette ligne est correcte
        catchError(() => of(0))
      ),
      lessors: this.http.get<{totalLessors: number}>(`${this.apiUrl}/lessor/analytics/statistics`).pipe(
        map(res => res.totalLessors || 0),
        catchError(() => of(0))
      ),
      clients: this.http.get<number>(`${this.apiUrl}/client/analytics/total`).pipe(
        catchError(() => of(0))
      ),
      reservations: this.http.get<any>(`${this.apiUrl}/reservations/analytics/statistics`).pipe(
        map(res => res.acceptanceMetrics?.total || 0),
        catchError(() => of(0))
      )
    }).pipe(
      map(results => ({
        totalHouses: results.houses,
        totalOffers: results.offers,
        totalLessors: results.lessors,
        totalClients: results.clients,
        totalReservations: results.reservations
      }))
    );
  }

  // Statistiques des réservations
  getReservationStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservations/analytics/statistics`).pipe(
      catchError(() => of({
        acceptanceMetrics: { 
          acceptanceRate: 0,
          total: 0,
          accepted: 0,
          rejected: 0 
        },
        statusDistribution: [],
        monthlyTrends: [],
        averageResponseTime: 0
      }))
    );
  }
  getRecentReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/recent-with-details?limit=5`).pipe(
      catchError(() => of([])),
      map(reservations => reservations.map(reservation => ({
        ...reservation,
        createdAt: new Date(reservation.createdAt) // Convertir en objet Date
      })))
    );
  }

  // Statistiques des offres
  getOfferStats(): Observable<any> {
    return forkJoin({
      stats: this.http.get<any>(`${this.apiUrl}/offre/analytics/stats`).pipe(
        catchError(err => {
          console.error('Error fetching offer stats:', err);
          return of({
            priceStatistics: { averagePrice: 0, minPrice: 0, maxPrice: 0 },
            monthlyTrends: [],
            totalOffers: 0,
            lastOffer: null,
            mostCommentedOffer: null,
            mostReservedOffer: null
          });
        }),
        map(res => ({
          ...res,
          priceStatistics: {
            averagePrice: res.priceStatistics?.averageprice || 0,
            minPrice: res.priceStatistics?.minprice || 0,
            maxPrice: res.priceStatistics?.maxprice || 0
          }
        }))
      ),
      reservations: this.http.get<any[]>(`${this.apiUrl}/offre/analytics/reservations`).pipe(
        catchError(err => {
          console.error('Error fetching offer reservations:', err);
          return of([]);
        })
      ),
      offers: this.http.get<any[]>(`${this.apiUrl}/offre/list-offre`).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map((result: { stats: any; reservations: any[]; offers: any[] }) => {
        // Find full offer details for the most commented and reserved offers
        const mostCommentedOffer = result.offers.find(o => o.id === result.stats.mostCommentedOffer?.offreId);
        const mostReservedOffer = result.offers.find(o => o.id === result.reservations[0]?.offreId);
  
        return {
          lastOffer: result.stats.lastOffer,
          mostCommentedOffer: mostCommentedOffer ? {
            ...result.stats.mostCommentedOffer,
            title: mostCommentedOffer.title,
            commentCount: result.stats.mostCommentedOffer.commentcount
          } : null,
          mostReservedOffer: mostReservedOffer ? {
            ...result.reservations[0],
            title: mostReservedOffer.title,
            reservationCount: result.reservations[0]?.reservationcount
          } : null,
          priceStatistics: {
            averagePrice: result.stats.priceStatistics?.averagePrice || 0,
            minPrice: result.stats.priceStatistics?.minPrice || 0,
            maxPrice: result.stats.priceStatistics?.maxPrice || 0
          },
          monthlyTrends: result.stats.monthlyTrends || [],
          topHouses: result.stats.topHouses || [],
          totalOffers: result.stats.totalOffers || 0
        };
      })
    );
  }

  // Top bailleurs
// Top bailleurs
getLessorPerformance(): Observable<any> {
  return forkJoin({
    performance: this.http.get<any[]>(`${this.apiUrl}/reservations/analytics/lessor-performance`).pipe(
      catchError(() => of([]))
    ),
    summary: this.http.get<any>(`${this.apiUrl}/lessor/analytics/summary`).pipe(
      catchError(() => of({
        totalLessors: 0,
        topLessorByHouses: null,
        topLessorByOffers: null,
        lastLessorWithOffer: null
      }))
    )
  }).pipe(
    map(({performance, summary}) => {
      const topLessors = performance.map(lessor => ({
        lessorId: lessor.lessorId,
        lessorName: lessor.lessorName || 'Non renseigné',
        houseCount: lessor.house_count || summary.topLessorByHouses?.housecount || 0,
        offerCount: lessor.offer_count || summary.topLessorByOffers?.offercount || 0,
        reservationCount: lessor.reservation_count || 0,
        acceptedReservations: lessor.accepted_reservations || 0,
        acceptanceRate: (lessor.accepted_reservations / (lessor.reservation_count || 1)) * 100 || 0
      }));

      return {
        topLessors: topLessors.slice(0, 5),
        summary: summary
      };
    })
  );
}

  // Statistiques des types de biens
  getHouseTypeStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/house/analytics/by-type`).pipe(
      map(data => data.map(type => ({
        type: type.type || 'Non spécifié',
        count: type.count || 0,
        averagePrice: type.averagePrice || 0
      }))),
      catchError(() => of([]))
    );
  }

  // Dans dashboard.service.ts
  getClientStats(): Observable<any> {
    return forkJoin({
      registrationTrends: this.http.get<any[]>(`${this.apiUrl}/Client/analytics/registration-trends`).pipe(
        catchError(() => of([{month: null, newclients: "0"}])) // Valeur par défaut explicite
      ),
      activityMetrics: this.http.get<any>(`${this.apiUrl}/Client/analytics/activity-metrics`).pipe(
        catchError(() => of({
          totalclients: "0",
          totalreservations: "0",
          avgreservationsperclient: "0",
          monthlyActivity: [{month: null, reservation_count: "0", active_clients: "0"}]
        }))
      ),
      totalClients: this.http.get<number>(`${this.apiUrl}/Client/analytics/total`).pipe(
        catchError(() => of(0)))
    }).pipe(
      map(({registrationTrends, activityMetrics, totalClients}) => {
        // Formatage des tendances d'inscription
        const formattedTrends = (registrationTrends || []).map((item: any) => ({
          month: item.month,
          formattedMonth: this.formatMonth(item.month),
          newClients: parseInt(item.newclients || item.newClients || '0', 10)
        }));
  
        // Formatage des métriques d'activité
        const formattedMetrics = {
          totalClients: parseInt(activityMetrics.totalclients || '0', 10),
          totalReservations: parseInt(activityMetrics.totalreservations || '0', 10),
          avgReservationsPerClient: parseFloat(activityMetrics.avgreservationsperclient || '0'),
          monthlyActivity: (activityMetrics.monthlyActivity || []).map((ma: any) => ({
            month: ma.month,
            formattedMonth: this.formatMonth(ma.month),
            reservationCount: parseInt(ma.reservation_count || '0', 10),
            activeClients: parseInt(ma.active_clients || '0', 10)
          }))
        };
  
        return {
          totalClients: totalClients || 0,
          registrationTrends: formattedTrends,
          activityMetrics: formattedMetrics,
          topClients: []
        };
      })
    );
  }
  
  private formatMonth(monthString: string | null): string {
    if (!monthString) return 'Non spécifié';
    
    try {
      // Gérer à la fois les formats 'YYYY-MM' et 'YYYY-MM-DD'
      const dateParts = monthString.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Les mois sont 0-indexés
      
      const date = new Date(year, month, 1);
      return date.toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric'
      });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return monthString;
    }
  }


  // Toutes les statistiques
  getAllStats(): Observable<any> {
    return forkJoin({
      global: this.getGlobalStats(),
      reservations: forkJoin({
        stats: this.getReservationStatistics(),
        recent: this.getRecentReservations()
      }),
      offers: this.getOfferStats(),
      lessors: this.getLessorPerformance(),
      houses: forkJoin({
        typeStats: this.getHouseTypeStats(),
        recentHouses: this.http.get<any[]>(`${this.apiUrl}/house`).pipe(
          catchError(() => of([])),
          map(data => data.slice(0, 5))
        )
      }),
      clients: this.getClientStats()
    }).pipe(
      map(results => ({
        global: results.global,
        reservations: {
          acceptanceRate: results.reservations.stats.acceptanceMetrics?.acceptanceRate || 0,
          totalReservations: results.reservations.stats.acceptanceMetrics?.total || 0,
          acceptedReservations: results.reservations.stats.acceptanceMetrics?.accepted || 0,
          rejectedReservations: results.reservations.stats.acceptanceMetrics?.rejected || 0,
          statusDistribution: results.reservations.stats.statusDistribution || [],
          monthlyTrends: results.reservations.stats.monthlyTrends || [],
          averageResponseTime: results.reservations.stats.averageResponseTime || 0,
          recentReservations: results.reservations.recent || []
        },
        offers: {
          lastOffer: results.offers.lastOffer,
          mostCommentedOffer: results.offers.mostCommentedOffer,
          mostReservedOffer: results.offers.mostReservedOffer,
          priceStats: results.offers.priceStatistics || {
            averagePrice: 0,
            minPrice: 0,
            maxPrice: 0
          },
          monthlyTrends: results.offers.monthlyTrends || [],
          topHouses: results.offers.topHouses || [],
          totalOffers: results.offers.totalOffers || 0
        },
        lessors: {
          topLessors: results.lessors.topLessors || [],
          summary: results.lessors.summary || {
            totalLessors: 0,
            topLessorByHouses: null,
            topLessorByOffers: null,
            lastLessorWithOffer: null
          },
          lessorGrowth: [] // À implémenter si disponible
        },
        houses: {
          houseTypeStats: results.houses.typeStats || [],
          recentHouses: results.houses.recentHouses || []
        },
        clients: {
          totalClients: results.clients.totalClients || 0,
          registrationTrends: results.clients.registrationTrends || [],
          activityMetrics: results.clients.activityMetrics || {
            totalClients: 0,
            totalReservations: 0,
            totalComments: 0,
            avgReservationsPerClient: 0
          },
          topClients: results.clients.topClients || []
        }
      })),
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        return of({});
      })
    );
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  

}