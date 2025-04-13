import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EquipementService } from '../equipement.service';
import { Equipement } from '../equipement';

@Component({
  selector: 'app-list-equipemnt',
  templateUrl: './list-equipemnt.component.html',
  styleUrls: ['./list-equipemnt.component.css'],
})
export class ListEquipemntComponent implements OnInit {
  equipements: Equipement[] = [];
  selectAll: boolean = false;
  selectedEquipements: Equipement[] = [];
  isButtonDisabled: boolean = true;
  close: boolean=false;

  constructor(
    private equipementService: EquipementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEquipements();
  }

  loadEquipements() {
    this.equipementService.getEquipements().subscribe(
      (data : Equipement[]) => {
        console.log('Data reçue :', data); // Vérifiez ici que les données ne sont pas nulles
        this.equipements = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des équipements', error);
      }
    );
  }
  

  // Sélectionner ou désélectionner tous les éléments
  toggleSelectAll() {
    this.equipements.forEach((equipement) => (equipement.selected = this.selectAll));
    this.onCheckboxChange();
  }

  // Mettre à jour la liste des éléments sélectionnés
  onCheckboxChange() {
    this.selectedEquipements = this.equipements.filter((equipement) => equipement.selected);
    this.isButtonDisabled = this.selectedEquipements.length === 0;
  }

  // Supprimer un équipement
  deleteEquipement(id: number) {
    this.equipementService.deleteEquipement(id).subscribe(
      () => {
        this.loadEquipements(); // Recharger la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'équipement', error);
      }
    );
  }

  // Rediriger vers la page de modification des éléments sélectionnés
  editRouter() {
    const selectedIds = this.selectedEquipements.map((equipement) => equipement.id);
    if (selectedIds.length === 1) {
      // Rediriger vers la page de modification d'un seul équipement
      this.router.navigate(['/equipement/update-equipement', selectedIds[0]]);
    } else {
      console.log('Modifier les équipements sélectionnés:', selectedIds);
      // Implémentez la logique pour modifier plusieurs équipements
    }
  }

  actionClose(){
    this.close=false
  }
  actionSave(){
    this.close=false
    this.loadEquipements()
  }
  actionOpen(){
    this.close=true
    console.log("close", this.close)
   
  }
  // Ouvrir le modal de confirmation de suppression
  // actionOpen() {
  //   const selectedIds = this.selectedEquipements.map((equipement) => equipement.id);
  //   if (confirm('Êtes-vous sûr de vouloir supprimer les équipements sélectionnés ?')) {
  //     this.equipementService.deleteMultiple(selectedIds).subscribe(
  //       () => {
  //         this.loadEquipements(); // Recharger la liste après suppression
  //       },
  //       (error) => {
  //         console.error('Erreur lors de la suppression des équipements', error);
  //       }
  //     );
  //   }
  // }
  // deleteMultipleEquipements() {
  //   const selectedIds = this.selectedEquipements.map(equipement => equipement.id);
  //   if (selectedIds.length > 0 && confirm('Êtes-vous sûr de vouloir supprimer ces équipements ?')) {
  //     this.equipementService.deleteMultiple(selectedIds).subscribe(
  //       () => {
  //         this.loadEquipements(); // Recharger la liste après suppression
  //       },
  //       (error) => {
  //         console.error('Erreur lors de la suppression des équipements', error);
  //       }
  //     );
  //   }
  // }
  
}