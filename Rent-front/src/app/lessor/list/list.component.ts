import { Component, OnInit } from '@angular/core';
import { LessorService } from '../lessor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  close: boolean = false;
  count: number = 0;
  lessors: any[] = [];
  filteredLessors: any[] = [];
  selectAll: boolean = false;
  isButtonDisabled: boolean = true;
  searchTerm: string = '';

  constructor(
    private lessorService: LessorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLessors();
  }

  loadLessors() {
    this.lessorService.getLessors().subscribe({
      next: (data) => {
        this.lessors = data[0].map((lessor: any) => ({
          ...lessor,
          selected: false
        }));
        this.filteredLessors = [...this.lessors];
        this.count = data[1];
      },
      error: (error) => {
        console.error('Erreur:', error);
        Swal.fire('Erreur', 'Impossible de charger les bailleurs', 'error');
      }
    });
  }

  filterLessors() {
    if (!this.searchTerm) {
      this.filteredLessors = [...this.lessors];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredLessors = this.lessors.filter(lessor => 
      lessor.firstName?.toLowerCase().includes(term) ||
      lessor.lastName?.toLowerCase().includes(term) ||
      lessor.email?.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterLessors();
  }

  onCheckboxChange() {
    this.isButtonDisabled = this.selectedLessors.length !== 1;
    this.selectAll = this.filteredLessors.length > 0 && 
                    this.filteredLessors.every(l => l.selected);
  }

  get selectedLessors() {
    return this.filteredLessors.filter(l => l.selected);
  }

  toggleSelectAll() {
    const newState = !this.selectAll;
    this.filteredLessors.forEach(l => l.selected = newState);
    this.onCheckboxChange();
  }

  actionOpen() {
    if (this.selectedLessors.length === 0) {
      Swal.fire('Erreur', 'Veuillez sélectionner au moins un bailleur', 'warning');
      return;
    }
    this.close = true;
  }

  actionClose() {
    this.close = false;
  }

  actionSave() {
    this.close = false;
    this.loadLessors();
  }

  editRouter() {
    if (this.selectedLessors.length !== 1) {
      Swal.fire('Erreur', 'Veuillez sélectionner un seul bailleur à modifier', 'warning');
      return;
    }
    this.router.navigate(['/lessor/update', this.selectedLessors[0].id]);
  }
}