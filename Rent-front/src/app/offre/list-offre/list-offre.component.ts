import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OffreService } from '../offre.service';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css']
})
export class ListOffreComponent implements OnInit {
  offres: any[] = []; 
  filteredOffres: any[] = [];
  selectedoffres: any[] = []; 
  selectAll: boolean = false; 
  isButtonDisabled: boolean = true; 
  close: boolean = false;
  searchTerm: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres() {
    this.offreService.getOffres().subscribe({
      next: (data: any[]) => {
        console.log('Données reçues:', data);
        this.offres = data.map(offre => {
          const imageUrl = offre.imageUrl || 
                         (offre.house?.pictures?.[0]?.url ?? 'assets/images/default-house.jpg');
          
          return {
            ...offre,
            imageUrl,
            priceTTC: this.calculateTTC(offre.priceHT, offre.tva),
            selected: false
          };
        });
        this.filteredOffres = [...this.offres];
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        Swal.fire('Erreur', 'Chargement des offres échoué', 'error');
      }
    });
  }

  filterOffres() {
    if (!this.searchTerm) {
      this.filteredOffres = [...this.offres];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredOffres = this.offres.filter(offre => {
      return offre.title?.toLowerCase().includes(term) ||
             offre.location?.toLowerCase().includes(term) ||
             offre.availability?.toLowerCase().includes(term) ||
             offre.description?.toLowerCase().includes(term);
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterOffres();
  }

  calculateTTC(priceHT: number, tvaPercent: number): number {
    return priceHT * (1 + tvaPercent / 100);
  }

  actionOpen() {
    this.selectedoffres = this.filteredOffres.filter(offre => offre.selected);
    if (this.selectedoffres.length > 0) {
      this.close = true;
    } else {
      Swal.fire('Erreur', 'Veuillez sélectionner des offres à supprimer', 'warning');
    }
  }

  actionClose() {
    this.close = false;
  }

  actionSave() {
    const idsToDelete = this.selectedoffres.map(offre => offre.id);
    this.offreService.deleteMultiple(idsToDelete).subscribe(
      () => {
        Swal.fire('Succès', 'Les offres ont été supprimées avec succès', 'success');
        this.loadOffres();
        this.close = false;
      },
      (error) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression des offres', 'error');
        console.error(error);
      }
    );
  }

  onCheckboxChange() {
    this.selectedoffres = this.filteredOffres.filter(offre => offre.selected);
    this.isButtonDisabled = this.selectedoffres.length === 0;
  }

  toggleSelectAll() {
    this.filteredOffres.forEach(offre => offre.selected = this.selectAll);
    this.onCheckboxChange();
  }

  editRouter() {
    const selected = this.filteredOffres.filter(offre => offre.selected);
    if (selected.length === 1) {
      this.router.navigate(['/offre/update-offre', selected[0].id]);
    } else {
      Swal.fire('Erreur', 'Veuillez sélectionner une seule offre à modifier', 'warning');
    }
  }

  reserver(offre: any) {
    this.router.navigate(['/reservation/add-reservation'], { queryParams: { offreId: offre.id } });
  }
}