import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaracteristiqueService } from '../caracteristique.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-caracteristique',
  templateUrl: './update-caracteristique.component.html',
  styleUrls: ['./update-caracteristique.component.css']
})
export class UpdateCaracteristiqueComponent implements OnInit {
  caracteristiqueForm: FormGroup; // Reactive form
  newImage: File | null = null; // For the new file upload
id:number=0
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private caracteristiqueService: CaracteristiqueService
  ) {
    this.caracteristiqueForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required], 
      image: [''], 
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) // Get the ID from the route
    if (this.id && !isNaN(this.id)) {
      // Fetch the caracteristique data from the server
      this.caracteristiqueService.getCharacteristicById(this.id).subscribe(
        (data) => {
          // Patch the fetched data into the form
          this.caracteristiqueForm.patchValue({
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.image,
          });
        },
        (error) => {
          console.error('Erreur lors du chargement de la caractéristique', error);
        }
      );
    } else {
      console.error('ID invalide ou non défini');
      this.router.navigate(['/caracteristiques']);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newImage = input.files[0]; 
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

    if (this.newImage) {
      formData.append('image', this.newImage);
    } else {
      formData.append('image', this.caracteristiqueForm.get('image')?.value);
    }
    this.caracteristiqueService.updateCharacteristic(this.id, formData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Succès !',
          text: 'La caractéristique a été mise à jour avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/caracteristique/list-caracteristique']); 
        });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la caractéristique', error);
        Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de la mise à jour de la caractéristique.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
