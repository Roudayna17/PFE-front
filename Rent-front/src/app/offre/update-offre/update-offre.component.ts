import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { House } from '../../house/house';
import { OffreService } from '../offre.service';

@Component({
  selector: 'app-update-offre',
  templateUrl: './update-offre.component.html',
  styleUrl: './update-offre.component.css'
})
export class UpdateOffreComponent {
  onHouseSelect($event: Event) {
  throw new Error('Method not implemented.');
  }
    offreForm!: FormGroup;
    houses: House[] = [];
    selectedHousePrice: number = 0;
    tva: number = 0;
  
    constructor(private fb: FormBuilder, private http: HttpClient) {}
  
    ngOnInit(): void {
      this.offreForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        houseId: [''],
        publicationDate: [''],
        publicationTime: [''],
        address: [''],
        priceHT: [0, Validators.required],
        tva: [this.tva, Validators.required],
        priceTTC: [{ value: 0, disabled: true }]
      });
  
      this.loadHouses();
    }
  
    // Charger la liste des maisons
    loadHouses() {
      this.http.get<House[]>('http://localhost:3000/house/list-house').subscribe(
        (data) => {
          this.houses = data;
        },
        (error) => {
          console.error('Erreur de chargement des maisons', error);
        }
      );
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
      if (this.offreForm.valid) {
        const offreData = {
          title: this.offreForm.value.title,
          description: this.offreForm.value.description,
          houseId: Number(this.offreForm.value.houseId),
          priceHT: this.offreForm.value.priceHT,
          tva: this.offreForm.value.tva,
          priceTTC: this.offreForm.value.priceTTC
        };
  
        this.http.post('http://localhost:3000/offre/update-offre', offreData).subscribe(
          () => alert('Offre modifiée avec succès !'),
          (error) => console.error('Erreur lors de modification', error)
        );
      }
    }
  }
  


