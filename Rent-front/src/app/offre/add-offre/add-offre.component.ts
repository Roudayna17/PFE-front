import { Component, OnInit, provideZoneChangeDetection } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  offreForm!: FormGroup;
  houses: House[] = [];
  selectedHousePrice: number = 0;
  tva: number = 0.19;  // TVA = 19%
  tcc: number = 0.02;  // TCC = 2%

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.offreForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      houseId: [''],
      provideZoneChangeDetection: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }]
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

  // Lorsque l'utilisateur sélectionne une maison
  onHouseSelect(event: any) {
    const selectedHouseId = Number(event.target.value);
    const selectedHouse = this.houses.find(house => house.id === selectedHouseId);
    
    if (selectedHouse) {
      this.selectedHousePrice = selectedHouse.price;
      this.calculateTotalPrice();
    }
  }

  // Calcul du prix total avec TVA et TCC
  calculateTotalPrice() {
    const price = this.selectedHousePrice;
    const totalPrice = price + (price * this.tva) + (price * this.tcc);
    this.offreForm.patchValue({
      price: price.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  }

  // Envoi du formulaire
  submitForm() {
    if (this.offreForm.valid) {
      const offreData = {
        title: this.offreForm.value.title,
        description: this.offreForm.value.description,
        houseId: Number(this.offreForm.value.houseId),
        price: this.selectedHousePrice,
        totalPrice: this.offreForm.value.totalPrice
      };

      this.http.post('http://localhost:3000/offre/create-offre', offreData).subscribe(
        () => alert('Offre ajoutée avec succès !'),
        (error) => console.error('Erreur lors de l\'ajout', error)
      );
    }
  }
}
