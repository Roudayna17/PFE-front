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
      html: `Êtes-vous sûr de vouloir supprimer <strong>${this.selectedList.length}</strong> offre(s) ?<br>
             <small class="text-red-500">Cette action supprimera aussi toutes les réservations et commentaires associés.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer définitivement',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.offreService.deleteMultiple(offreIds).toPromise()
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
          text: `${result.value?.deletedCount || this.selectedList.length} offre(s) supprimée(s) avec succès.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.save.emit(true);
      }
    });
  }
}