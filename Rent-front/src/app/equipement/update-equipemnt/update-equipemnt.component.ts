import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipementService } from '../equipement.service';
import { Equipement } from '../equipement';

@Component({
  selector: 'app-update-equipment',
  templateUrl: './update-equipemnt.component.html',
  styleUrls: ['./update-equipemnt.component.css'],
})
export class UpdateEquipemntComponent implements OnInit {
  equipment: Equipement = {
    id: 0,
    nom: '',
    description: '',
    image: '',
    created_at: new Date(),
  };
  newImage: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipementService: EquipementService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.equipementService.getEquipementById(+id).subscribe((data) => {
        this.equipment = data;
        console.log("data",data)
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.newImage = event.target.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('nom', this.equipment.nom);
    formData.append('description', this.equipment.description);
    if (this.newImage) {
      formData.append('image', this.newImage); // Ajouter la nouvelle image
    }

    this.equipementService.updateEquipement(this.equipment.id, formData).subscribe(
      (response) => {
        console.log('Équipement mis à jour avec succès', response);
        this.router.navigate(['/equipements']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'équipement', error);
      }
    );
    
  }
}