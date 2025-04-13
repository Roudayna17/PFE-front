import { Component, OnInit } from '@angular/core';
import { CaracteristiqueService } from '../caracteristique.service';
import { Caracteristique } from '../caracteristique';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-caracteristique',
  templateUrl: './list-caracteristique.component.html',
  styleUrls: ['./list-caracteristique.component.css']
})
export class ListCaracteristiqueComponent implements OnInit {
  caracteristiques: Caracteristique[] = [];  
  selectAll: boolean = false;
  selectedCaracteristiques: Caracteristique[] = [];
  isButtonDisabled: boolean = true;
  close: boolean = false;  
  constructor(private caracteristiqueService: CaracteristiqueService, private router: Router) {}

  ngOnInit(): void {
    this.loadCaracteristiques();
  }

  loadCaracteristiques(): void {
    this.caracteristiqueService.getCharacteristics().subscribe(
      (data: Caracteristique[]) => {
        this.caracteristiques = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des caractéristiques', error);
      }
    );
  }

  toggleSelectAll(): void {
    if (this.caracteristiques && this.caracteristiques.length > 0) {
      this.caracteristiques.forEach((caracteristique) => (caracteristique.selected = this.selectAll));
      this.onCheckboxChange();
    }
  }

  onCheckboxChange(): void {
    this.selectedCaracteristiques = this.caracteristiques.filter((caracteristique) => caracteristique.selected);
    this.isButtonDisabled = this.selectedCaracteristiques.length === 0;
  }

  deleteCaracteristique(id: number): void {
    this.caracteristiqueService.deleteCharacteristic(id).subscribe(
      () => {
        this.loadCaracteristiques();  
      },
      (error) => {
        console.error('Erreur lors de la suppression de la caractéristique', error);
      }
    );
  }

  editRouter(): void {
    const selectedIds = this.selectedCaracteristiques.map((caracteristique) => caracteristique.id); 

    if (selectedIds.length === 1) {
      this.router.navigate(['/caracteristique/update-caracteristique', selectedIds[0]]);
    } else if (selectedIds.length > 1) {
      console.log('Multiple characteristics selected:', selectedIds);
    } else {
      console.log('No characteristics selected.');
    }
  }
  actionClose(){
    this.close=false
  }
  actionSave(){
    this.close=false
    this.loadCaracteristiques()
  }

  actionOpen(): void {
    this.close = true;
    console.log("Modal opened:", this.close);
  }
}
