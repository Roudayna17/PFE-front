import { Component, OnInit } from '@angular/core';
import { LocataireService } from '../locataire.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-locataire',
  templateUrl: './list-locataire.component.html',
  styleUrls: ['./list-locataire.component.css']
})
export class ListLocataireComponent implements OnInit {
  close: boolean = false;
  locataires: any[] = [];
  filteredLocataires: any[] = [];
  selectAll: boolean = false;
  isButtonDisabled: boolean = true;
  searchTerm: string = '';

  constructor(
    private locataireService: LocataireService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLocataires();
  }

  loadLocataires() {
    this.locataireService.listClient().subscribe({
      next: (data) => {
        this.locataires = data[0].map((locataire: any) => ({
          ...locataire,
          selected: false
        }));
        this.filteredLocataires = [...this.locataires];
      },
      error: (error) => {
        console.error('Erreur:', error);
        Swal.fire('Erreur', 'Impossible de charger les locataires', 'error');
      }
    });
  }

  filterLocataires() {
    if (!this.searchTerm) {
      this.filteredLocataires = [...this.locataires];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredLocataires = this.locataires.filter(locataire => 
      locataire.firstName?.toLowerCase().includes(term) ||
      locataire.lastName?.toLowerCase().includes(term) ||
      locataire.email?.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterLocataires();
  }

  onCheckboxChange() {
    this.isButtonDisabled = this.selectedLocataires.length !== 1;
    this.selectAll = this.filteredLocataires.length > 0 && 
                    this.filteredLocataires.every(l => l.selected);
  }

  get selectedLocataires() {
    return this.filteredLocataires.filter(l => l.selected);
  }

  toggleSelectAll() {
    const newState = !this.selectAll;
    this.filteredLocataires.forEach(l => l.selected = newState);
    this.onCheckboxChange();
  }

  actionOpen() {
    if (this.selectedLocataires.length === 0) {
      Swal.fire('Erreur', 'Veuillez sélectionner au moins un locataire', 'warning');
      return;
    }
    this.close = true;
  }

  actionClose() {
    this.close = false;
  }

  actionSave() {
    this.close = false;
    this.loadLocataires();
  }

  editRouter() {
    if (this.selectedLocataires.length !== 1) {
      Swal.fire('Erreur', 'Veuillez sélectionner un seul locataire à modifier', 'warning');
      return;
    }
    this.router.navigate(['/locataire/update-locataire', this.selectedLocataires[0].id]);
  }
}