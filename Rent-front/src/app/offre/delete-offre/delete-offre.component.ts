import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OffreService } from '../offre.service';

@Component({
  selector: 'app-delete-offre',
  templateUrl: './delete-offre.component.html',
  styleUrls: ['./delete-offre.component.css']
})
export class DeleteOffreComponent {
  @Input('selectedList') selectedList: any[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<boolean>();

  constructor(private offreService: OffreService) {}

  closedEvent() {
    this.close.emit(true);
  }

  deletelist() {
    if (this.selectedList.length === 0) {
      console.warn('Aucune offre sélectionnée !');
      return;
    }

    const offreIds = this.selectedList.map((offre) => offre.id);
    console.log('Offres sélectionnées :', offreIds);

    this.offreService.deleteMultiple(offreIds).subscribe(
      (data: any) => {
        console.log('Suppression réussie', offreIds);
        this.save.emit(true); 
      },
      (error) => {
        console.error('Échec de la suppression', error);
      }
    );
  }
}
