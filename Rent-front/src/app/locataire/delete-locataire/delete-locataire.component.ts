import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocataireService } from '../locataire.service';

@Component({
  selector: 'app-delete-locataire',
  templateUrl: './delete-locataire.component.html',
  styleUrls: ['./delete-locataire.component.css']
})
export class DeleteLocataireComponent {
   @Input('selectedList') selectedList: any[] = [];
  
    @Output()
    close= new EventEmitter<boolean>()
    @Output()
    save= new EventEmitter<boolean>()
    constructor(private locataireService:LocataireService){
  
    }
    closedEvent()
    {
      this.close.emit(true)
    }
    deletelist() {
      if (this.selectedList.length === 0) {
        console.warn("Aucun utilisateur sélectionné !");
        return;
      }
    
      const locataireIds = this.selectedList.map(locataire => locataire.id);
      console.log("Utilisateurs sélectionnés :", locataireIds);
    
      this.locataireService.DeleteMultiple(locataireIds).subscribe(data => {
        this.save.emit(true);
      });
    }
    
  
  }
  

