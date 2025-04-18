import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OffreService } from '../offre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-offre',
  templateUrl: './delete-offre.component.html',
  styleUrls: ['./delete-offre.component.css']
})
export class DeleteOffreComponent {
  @Input() selectedList: any[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<boolean>();

  constructor(private offreService: OffreService) {}

  closedEvent() {
    this.close.emit(true);
  }

  deletelist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  
    if (this.selectedList.length === 0) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner au moins une offre à supprimer',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const offreIds = this.selectedList.map(offre => offre.id);
    
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer <strong>${this.selectedList.length}</strong> offre(s) ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.offreService.deleteMultiple(offreIds).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Succès!',
              text: 'Les offres ont été supprimées avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.save.emit(true);
          },
          (error) => {
            let errorMessage = 'Une erreur est survenue lors de la suppression';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            Swal.fire({
              title: 'Erreur',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Échec de la suppression', error);
          }
        );
      }
    });
  }}