import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CaracteristiqueService } from '../caracteristique.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-caracteristique',
  templateUrl: './add-caracteristique.component.html',
})
export class AddCaracteristiqueComponent implements OnInit {
  caracteristiqueForm: FormGroup; // Reactive form
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private caracteristiqueService: CaracteristiqueService,
    private router: Router
  ) {
    this.caracteristiqueForm = this.fb.group({
      title: ['', Validators.required], 
      description: ['', Validators.required], 
      quantity: [null, Validators.min(1)],
      icon: [null], 
    });
  }

  ngOnInit(): void {
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.caracteristiqueForm.patchValue({ icon: file });
      this.caracteristiqueForm.get('icon')?.updateValueAndValidity();
      const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

  onSubmit(): void {
    if (this.caracteristiqueForm.invalid) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.caracteristiqueForm.get('title')?.value);
    formData.append('description', this.caracteristiqueForm.get('description')?.value);

    const quantity = this.caracteristiqueForm.get('quantity')?.value;
    if (quantity !== null) {
      formData.append('quantity', quantity.toString());
    }

    const file = this.caracteristiqueForm.get('icon')?.value;
    if (file) {
      formData.append('image', file); // Add the selected file
    }

    this.caracteristiqueService.addCharacteristics(formData).subscribe(
      (response) => {
        console.log('Caractéristique ajoutée avec succès', response);
        Swal.fire({
          title: 'Succès !',
          text: 'La caractéristique a été ajoutée avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/caracteristique']); 
        });
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la caractéristique', error);
        Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de l\'ajout de la caractéristique.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
