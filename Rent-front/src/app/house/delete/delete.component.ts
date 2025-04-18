import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HouseService } from '../house.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {
  @Input() selectedList: any[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<boolean>();

  constructor(private houseService: HouseService) {}

  closedEvent() {
    this.close.emit(true);
  }

  deletelist(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.selectedList.length === 0) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner au moins un logement à supprimer',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const houseIds = this.selectedList.map(house => house.id);
    
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer <strong>${this.selectedList.length}</strong> logement(s) et toutes leurs données associées (photos, offres, etc.) ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.houseService.deleteMultiple(houseIds).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Succès!',
              text: 'Les logements et toutes leurs données associées ont été supprimés avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.save.emit(true);
          },
          (error) => {
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Échec de la suppression', error);
          }
        );
      }
    });
  }
}