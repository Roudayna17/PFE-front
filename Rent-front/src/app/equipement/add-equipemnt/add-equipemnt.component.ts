import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipementService } from '../equipement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-equipemnt',
  templateUrl: './add-equipemnt.component.html',
  styleUrls: ['./add-equipemnt.component.css'],
})
export class AddEquipemntComponent implements OnInit {
  equipementForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private equipementService: EquipementService
  ) {
    this.equipementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      icon: [null],
    });
  }

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Vérifier si un fichier a été sélectionné
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérifier que le fichier est bien une image
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Erreur !',
          text: 'Veuillez télécharger un fichier image (PNG, JPG, GIF).',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }

      // Lire le fichier pour l'aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // Mise à jour de l'aperçu
      };
      reader.readAsDataURL(file); // Lire le fichier comme URL de données

      // On ne change pas la valeur directement dans le formulaire pour les fichiers
      this.equipementForm.patchValue({ icon: file });
      this.equipementForm.get('icon')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    // Vérification si le formulaire est invalide ou si certains champs sont vides
    if (this.equipementForm.get('title')?.invalid || this.equipementForm.get('description')?.invalid || this.equipementForm.get('icon')?.invalid) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.equipementForm.get('title')?.value);
    formData.append('description', this.equipementForm.get('description')?.value);

    const icon = this.equipementForm.get('icon')?.value;
    if (icon) {
      formData.append('image', icon);
    }

    this.equipementService.addEquipement(formData).subscribe(
      (response) => {
        console.log('Équipment ajouté avec succès', response);
        Swal.fire({
          title: 'Succès !',
          text: "L'équipment a été ajouté avec succès.",
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/equipement']);
        });
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'équipement", error);
        Swal.fire({
          title: 'Erreur !',
          text: "Une erreur est survenue lors de l'ajout de l'équipement.",
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
