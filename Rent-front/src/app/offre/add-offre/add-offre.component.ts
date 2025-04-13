import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

import { OffreService } from '../offre.service';
import { HouseService } from '../../house/house.service';

interface House {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-add-offre',
  templateUrl: './add-offre.component.html',
})
export class AddOffreComponent implements OnInit {
  houseData: any;
  form: any;
  tva: number = 0;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  offreForm!: FormGroup;
  houses: House[] = [];
  selectedHousePrice: number = 0;
  houseId: number | null = null;


  constructor(private fb: FormBuilder, private http: HttpClient,private offreService: OffreService, private router: Router, private houseService: HouseService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    const now = new Date(); // Récupérer la date et l'heure actuelles
  const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
    this.offreForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      houseId: [null], // Initialiser à null
      created_at: [formattedDate], // Initialisation auto
      time: [formattedTime], // Initialisation auto
      location: ['', Validators.required],
      type:['', Validators.required],
      availability: ['', Validators.required],
      priceHT: [0, Validators.required],
      tva: [this.tva, Validators.required],
      priceTTC: [{ value: 0, disabled: true }]
    });
     // Ensuite, force la mise à jour avec patchValue
  this.offreForm.patchValue({
    created_at: formattedDate,
    time: formattedTime
  });

    this.route.queryParams.subscribe(params => {
      this.houseId = params['houseId'] ? Number(params['houseId']) : null;
      if (this.houseId) {
        this.offreForm.patchValue({ houseId: this.houseId }); // Mettre à jour le formulaire
        this.loadHouseData(this.houseId);
      }
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      // Afficher un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result ?? null; // Correction ici
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  // Charger la liste des maisons
  loadHouseData(houseId: number) {
    this.houseService.getHouseById(houseId).subscribe(house => {
      console.log("Données maison récupérées:", house);
  
      this.houseData = house;
      this.offreForm.patchValue({
        title: house.title,
        description: house.description,
        priceHT: house.price,
        tva: house.tva,
        priceTTC: house.priceTTC,
        type: house.type,
        location: house.location
      });
      if (house.pictures && house.pictures.length > 0) {
        this.previewImage = house.pictures[0].url; // ou house.pictures.find(p => p.isMain)?.url si tu gères ça côté DB
      }
      
    });
  }
  // Calculer le prix TTC
  calculateTTC() {
    const priceHT = this.offreForm.get('priceHT')?.value || 0;
    const tvaValue = this.offreForm.get('tva')?.value || 0;
    
    // Calcul du prix TTC
    const ttc = priceHT * (1 + tvaValue / 100);
    this.offreForm.patchValue({
      priceTTC: ttc.toFixed(2)
    });
  }

 

  // Envoi du formulaire
  submitForm() {
     // Vérifiez que houseId est bien défini
  if (!this.houseId) {
    Swal.fire('Erreur', 'Aucune maison sélectionnée', 'error');
    return;
  }
    // Vérification des champs obligatoires avant soumission
    if (this.offreForm.invalid) {
      // Affichage d'un message d'erreur avec SweetAlert2
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Ne pas soumettre si le formulaire est invalide
    }
   
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
  

    const offreData = {
      title: this.offreForm.value.title,
      description: this.offreForm.value.description,
      houseId: this.houseId, // On s'assure que l'ID est bien inclus
      availability: this.offreForm.value.availability,
      created_at: formattedDate, // Ajout de la date actuelle
      time: formattedTime, // Ajout de l'heure actuelle
      location:this.offreForm.value.location,
      priceHT: this.offreForm.value.priceHT,
      tva: this.offreForm.value.tva,
      priceTTC: this.offreForm.value.priceTTC
    };
    console.log('Données envoyées:', offreData); // Pour débogage
    this.offreService. addOffre(offreData).subscribe(
      (response: any) => {
        console.log('offre ajouté avec succès', response);

        // Affichage du message de succès avec SweetAlert2
        Swal.fire({
          title: 'Succès !',
          text: 'L\'offre a été ajoutée avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['offre/list-offre']); // Remplacez '/offres' par le chemin réel de votre liste des offres

          
        });
      },
      (error: any) => {
        console.error('Erreur lors de l\'ajout', error);
        // Affichage du message d'erreur avec SweetAlert2
        Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de l\'ajout de l\'offre.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
