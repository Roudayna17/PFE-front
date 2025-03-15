import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LessorService } from '../lessor.service';

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
      constructor(private lessorService:LessorService){
    
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
      
        const lessorIds = this.selectedList.map(lessor => lessor.id);
        console.log("Bailleurs sélectionnés :", lessorIds);
      
        this.lessorService.deleteMultipleLessor(lessorIds).subscribe(data => {
          this.save.emit(true);
        });
      }

}
