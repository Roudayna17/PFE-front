import { Component } from '@angular/core';
import { LessorService } from '../lessor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
    close: boolean=false;
    count: number=0;
    locataires: any[] = []; // Array to store locataires
    selectAll: boolean = false; // Flag to track "select all" checkbox state
    isButtonDisabled: boolean = true; // Disable buttons initially
  
    constructor(private lessorService: LessorService , private router:Router) { }
  
    ngOnInit(): void {
      this.getListLessor();
    }
   
    // Method to get list of locataires from the service
    getListLessor() {
      this.lessorService.getLessors().subscribe(data => {
        this.locataires = data[0]; 
        this.count=data[1] // Assuming the locataires are in the first array
      });
    }
  
    // Method to handle checkbox changes and update button status
    onCheckboxChange() {
      this.isButtonDisabled = this.selectedLessors.length !== 1; // Button enabled only when one locataire is selected
    }
  
    // Helper method to get the number of selected locataires
    get selectedLessors() {
      return this.locataires.filter(locataire => locataire.selected); // Filters locataires that are selected
    }
  
    // Method to toggle the selection of all locataires
    toggleSelectAll() {
      this.locataires.forEach(locataire => locataire.selected = this.selectAll);
      this.onCheckboxChange();  // Update button state after toggling "select all"
    }
  
    // Method to check if all locataires are selected, used to update "select all" checkbox
    checkIfAllSelected() {
      this.selectAll = this.locataires.every(locataire => locataire.selected);
    }
  
    // Method to update "select all" checkbox when a single locataire is selected or deselected
    updateSelectAll() {
      this.checkIfAllSelected();
    }
    
    actionClose(){
      this.close=false
    }
    actionSave(){
      this.close=false
      this.getListLessor()
    }
    actionOpen(){
      this.close=true
      console.log("close", this.close)
     
    }
    editRouter(){
      let id=this.selectedLessors[0].id
      this.router.navigateByUrl("/lessor/update/"+String(id))
    }

}
