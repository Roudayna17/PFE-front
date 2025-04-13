import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HouseService } from '../house.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
  @Input('selectedList') selectedList: any[] = [];
        
          @Output()
          close= new EventEmitter<boolean>()
          @Output()
          save= new EventEmitter<boolean>()
          constructor(private HouseService:HouseService){
        
          }
          closedEvent()
          {
            this.close.emit(true)
          }
          // Dans delete.component.ts
deletelist() {
  if (this.selectedList.length === 0) {
    Swal.fire('Erreur', 'Veuillez sélectionner au moins un logement à supprimer', 'warning');
    return;
  }

  const houseIds = this.selectedList.map(house => house.id);
  
  Swal.fire({
    title: 'Confirmer la suppression',
    text: `Êtes-vous sûr de vouloir supprimer ${this.selectedList.length} logement(s) et leurs offres associées ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.HouseService.deleteMultiple(houseIds).subscribe(
        (data: any) => {
          Swal.fire('Succès!', 'Les logements et leurs offres ont été supprimés avec succès.', 'success');
          this.save.emit(true);
        },
        (error) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression', 'error');
          console.error('Échec de la suppression', error);
        }
      );
    }
  });
}
}
