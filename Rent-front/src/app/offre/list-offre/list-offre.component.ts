import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';  // Pour afficher les notifications
import { Router } from '@angular/router';
import { OffreService } from '../offre.service';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css']
})
export class ListOffreComponent implements OnInit {
  offres: any[] = []; 
  selectedoffres: any[] = []; 
  selectAll: boolean = false; 
  isButtonDisabled: boolean = true; 
  close: boolean = false; 
  constructor(private http: HttpClient, private router: Router,offreService:OffreService) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres() {
    this.http.get<any[]>('http://localhost:3000/offre/list-offre').subscribe(
      data => {
        console.log('Données récupérées :', data);
        this.offres = data;
      },
      error => {
        console.error('Erreur lors du chargement des offres', error);
        Swal.fire('Erreur', 'Impossible de charger les offres', 'error');
      }
    );
  }

  actionOpen() {
    const selected = this.offres.filter(offre => offre.selected);
    if (selected.length > 0) {
      this.selectedoffres = selected;
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
    this.http.post('http://localhost:3000/offre/delete-offre', { ids: idsToDelete }).subscribe(
      () => {
        Swal.fire('Succès', 'Les offres ont été supprimées avec succès', 'success');
        this.loadOffres();  
      },
      error => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression des offres', 'error');
        console.error(error);
      }
    );
    this.close = false;
  }

  onCheckboxChange() {
    this.isButtonDisabled = this.offres.every(offre => !offre.selected);
  }

  toggleSelectAll() {
    this.offres.forEach(offre => offre.selected = this.selectAll);
    this.isButtonDisabled = !this.selectAll;
  }

  navigateToAddOffer() {
  }

  editRouter() {
    const selectedIds = this.selectedoffres.map((offre:any) => offre.id);
    if (selectedIds.length === 1) {
      this.router.navigate(['/offre/update-offre', selectedIds[0]]);
    } else {
      console.log('Modifier l offre sélectionné:', selectedIds);
    }
  
  }
}
