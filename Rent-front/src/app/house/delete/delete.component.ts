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
      html: `Êtes-vous sûr de vouloir supprimer <strong>${this.selectedList.length}</strong> logement(s) ?<br>
             <small class="text-red-500">Cette action est irréversible et supprimera toutes les données associées.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer définitivement',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.houseService.deleteMultiple(houseIds).toPromise()
          .catch(error => {
            Swal.showValidationMessage(
              `Échec de la suppression: ${error.error?.message || error.message}`
            );
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Suppression réussie!',
          text: `${result.value?.deletedCount || this.selectedList.length} logement(s) supprimé(s) avec succès.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.save.emit(true);
      }
    });
  }
  }