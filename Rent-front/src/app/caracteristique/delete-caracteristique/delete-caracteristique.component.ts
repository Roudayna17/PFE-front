import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importez SweetAlert2
import { CaracteristiqueService } from '../caracteristique.service';

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
   @Input('selectedList') selectedList: any[] = [];
        
          @Output()
          close= new EventEmitter<boolean>()
          @Output()
          save= new EventEmitter<boolean>()
          constructor(private caracteristiqueService:CaracteristiqueService){
        
          }
          closedEvent()
          {
            this.close.emit(true)
          }
          deletelist() {
            if (this.selectedList.length === 0) {
              console.warn("Aucun caractéristique sélectionné !");
              return;
            }
          
            const caracteristiqueIds = this.selectedList.map(caracteristique => caracteristique.id);
            console.log("caractéristique sélectionnés :", caracteristiqueIds);
          
            this.caracteristiqueService.deleteMultiple(caracteristiqueIds).subscribe(data => {
              this.save.emit(true);
            });
          }
    
  }