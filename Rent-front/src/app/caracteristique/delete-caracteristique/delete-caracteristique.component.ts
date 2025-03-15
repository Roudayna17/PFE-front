import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Caracteristique {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-delete-caracteristique',
  templateUrl: './delete-caracteristique.component.html',
  styleUrls: ['./delete-caracteristique.component.css']
})
export class DeleteCaracteristiqueComponent {
  caracteristiques: Caracteristique[] = []; 
  showDeleteAlert = false;  
  caracteristiqueToDeleteId: number | null = null;  

  constructor(private http: HttpClient, private router: Router) {}

  openDeleteConfirmation(id: number) {
    this.caracteristiqueToDeleteId = id;  
    this.showDeleteAlert = true;  
  }

  cancelDelete() {
    this.showDeleteAlert = false;  
    this.caracteristiqueToDeleteId = null;  
  }

  deleteCaracteristique() {
    if (this.caracteristiqueToDeleteId !== null) {
      this.http.delete(`http://localhost:3000/characteristic/${this.caracteristiqueToDeleteId}`).subscribe(
        (response) => {
          console.log('Caractéristique supprimée avec succès!', response);
          this.caracteristiques = this.caracteristiques.filter(
            (caracteristique: Caracteristique) => caracteristique.id !== this.caracteristiqueToDeleteId
          );
          this.showDeleteAlert = false; 
          this.caracteristiqueToDeleteId = null;  
        },
        (error) => {
          console.error('Erreur lors de la suppression de la caractéristique', error);
        }
      );
    }
  }
}
