import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipementService } from '../equipement.service';
import { Equipement } from '../equipement';
import Swal from 'sweetalert2'; // Importer SweetAlert2

@Component({
  selector: 'app-update-equipment',
  templateUrl: './update-equipemnt.component.html',
  styleUrls: ['./update-equipemnt.component.css'],
})
export class UpdateEquipemntComponent implements OnInit {
  equipement: Equipement = {
    id: 0,
    name:"",
    title: '',
    description: '',
    image: '',
    created_at: new Date(),
  };
  newImage: File | null = null; // Pour stocker la nouvelle image sélectionnée
  imagePreview: string | ArrayBuffer | null = null; // Pour afficher l'aperçu de la nouvelle image

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipementService: EquipementService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Récupérer les détails de l'équipement par son ID
      this.equipementService.getEquipementById(+id).subscribe(
        (data) => {
          this.equipement = data;
          console.log('Données de l\'équipement récupérées :', data);
        },
        (error) => {
          console.error('Erreur lors de la récupération des données de l\'équipement', error);
        }
      );
    }
  }

  // Gérer le changement de fichier (nouvelle image)
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.newImage = event.target.files[0];
      console.log('Nouvelle image sélectionnée :', this.newImage); // Debug

      // Afficher l'aperçu de la nouvelle image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      if (this.newImage) {
        reader.readAsDataURL(this.newImage);
      }
    }
  }

  // Soumettre le formulaire de mise à jour
  onSubmit() {
    // Vérification des champs obligatoires
    if (!this.equipement.title || !this.equipement.description) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.equipement.title);
    formData.append('description', this.equipement.description);

    // Ajouter la nouvelle image uniquement si elle existe
    if (this.newImage) {
      formData.append('image', this.newImage, this.newImage.name); // Ajoutez le nom du fichier
      console.log('Fichier ajouté à FormData :', this.newImage); // Debug
    }

    // Mettre à jour l'équipement
    this.equipementService.updateEquipement(this.equipement.id, formData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Succès !',
          text: 'L\'équipement a été mis à jour avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Après avoir cliqué sur OK, naviguer directement vers la liste des équipements
          this.router.navigate(['/equipement']);
        });        
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'équipement', error);
        Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de la mise à jour de l\'équipement.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
