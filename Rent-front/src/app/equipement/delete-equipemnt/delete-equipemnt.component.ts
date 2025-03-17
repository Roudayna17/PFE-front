import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EquipementService } from '../equipement.service';
import Swal from 'sweetalert2'; // Importez SweetAlert2

@Component({
  selector: 'app-delete-equipemnt',
  templateUrl: './delete-equipemnt.component.html',
  styleUrls: ['./delete-equipemnt.component.css']
})
export class DeleteEquipemntComponent {
     @Input('selectedList') selectedList: any[] = [];
      
        @Output()
        close= new EventEmitter<boolean>()
        @Output()
        save= new EventEmitter<boolean>()
        constructor(private equipementService:EquipementService){
      
        }
        closedEvent()
        {
          this.close.emit(true)
        }
        deletelist() {
          if (this.selectedList.length === 0) {
            console.warn("Aucun bailleur sélectionné !");
            return;
          }
        
          const equipementIds = this.selectedList.map(equipement => equipement.id);
          console.log("Bailleurs sélectionnés :", equipementIds);
        
          this.equipementService.deleteMultiple(equipementIds).subscribe(data => {
            this.save.emit(true);
          });
        }
  
}