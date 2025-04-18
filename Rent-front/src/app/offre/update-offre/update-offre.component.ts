import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { House } from '../../house/house';
import { OffreService } from '../offre.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-offre',
  templateUrl: './update-offre.component.html',
  styleUrl: './update-offre.component.css'
})
export class UpdateOffreComponent implements OnInit {

  offreForm!: FormGroup;
  houses: House[] = [];
  selectedHousePrice: number = 0;
  tva: number = 0;
  offreId: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private offreService: OffreService,
    private router: Router
  ) {}

  ngOnInit(): void {
      const now = new Date(); // Récupérer la date et l'heure actuelles
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
    this.offreForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      houseId: [''],
      created_at: [formattedDate], // Initialisation auto
      time: [formattedTime], // Initialisation auto
      priceHT: [0, Validators.required],
      tva: [this.tva, Validators.required],
      priceTTC: [{ value: 0, disabled: true }],
      availability: ['', Validators.required],
    });

    this.loadHouses();

    this.route.paramMap.subscribe(params => {
      this.offreId = +params.get('id')!;
      this.loadOffreDetails(this.offreId);
    });
  }

  // Charger les détails de l'offre
  loadOffreDetails(id: number): void {
    this.http.get<any>(`http://localhost:3000/offre/detail-offre/${id}`).subscribe(
      (data) => {
        this.offreForm.patchValue({
          title: data.title,
          description: data.description,
          availability:data.availability,
          houseId: data.houseId,
          priceHT: data.priceHT,
          tva: data.tva,
          priceTTC: data.priceTTC
        });

        const selectedHouse = this.houses.find(house => house.id === data.houseId);
        if (selectedHouse) {
          this.selectedHousePrice = selectedHouse.price;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'offre', error);
      }
    );
  }

  // Charger les maisons
  loadHouses() {
    this.http.get<House[]>('http://localhost:3000/house/list-house').subscribe(
      (data) => this.houses = data,
      (error) => console.error('Erreur de chargement des maisons', error)
    );
  }

  // Calcul du prix TTC
  calculateTTC() {
    const priceHT = this.offreForm.get('priceHT')?.value || 0;
    const tvaValue = this.offreForm.get('tva')?.value || 0;
    const ttc = priceHT * (1 + tvaValue / 100);
    this.offreForm.patchValue({
      priceTTC: ttc.toFixed(2)
    });
  }

  // Utilitaires pour date et heure actuelles
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; // yyyy-MM-dd
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0].slice(0, 5); // HH:mm
  }

  // Soumission du formulaire
  submitForm() {
    if (this.offreForm.valid) {
      const offreData = {
        title: this.offreForm.value.title,
        description: this.offreForm.value.description,
        created_at: this.getTodayDate(),
        time: this.getCurrentTime(),
        houseId: Number(this.offreForm.value.houseId),
        priceHT: this.offreForm.value.priceHT,
        tva: this.offreForm.value.tva,
        priceTTC: this.offreForm.value.priceTTC,
        availability:this.offreForm.value.availability
      };

      this.http.patch(`http://localhost:3000/offre/update-offre/${this.offreId}`, offreData).subscribe(
        () => {
          Swal.fire({
            title: 'Succès!',
            text: 'Offre modifiée avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/offre/list-offre']);
          });
        },
        (error) => {
          console.error('Erreur lors de modification', error);
          Swal.fire({
            title: 'Erreur!',
            text: 'Erreur lors de la modification de l\'offre.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}
