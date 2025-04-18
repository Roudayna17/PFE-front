import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../house.service';
import { Router } from '@angular/router';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';
import { EquipementService } from '../../equipement/equipement.service';
import { Picture } from '../house';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, AfterViewInit, OnDestroy {
  arrayDetails: any = [];
  houseForm: FormGroup;
  characteristics: any[] = [];
  equipements: any[] = [];
  pictureArray: Picture[] = [];
  arrayCharacteristics: { id: number; quantite: number }[] = [];
  arrayEquipements: { id: number; quantite: number }[] = [];
  houseId!: number;
  quantityCharat: number = 0;
  selectedAddress: string = '';
  private map!: L.Map;
  private marker!: L.Marker;
  private resizeObserver!: ResizeObserver;

  constructor(
    private fb: FormBuilder,
    private houseService: HouseService,
    private router: Router,
    private characteristicService: CaracteristiqueService,
    private equipementService: EquipementService
  ) {
    this.houseForm = this.fb.group({
      title: ['', Validators.required],
      location: [''], 
      description: [''],
      poste_code: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
      surface: ['', Validators.required],
      rooms: ['', Validators.required],
      bedrooms: ['', Validators.required],
      bathrooms: ['', Validators.required],
      price: ['', Validators.required],
      type: ['', Validators.required],
      latitude: [36.8065, Validators.required],
      longitude: [10.1815, Validators.required],
      characteristics: [],
      equipements: [],
      pictures: [],
      lessorId: [],
      userId: [],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.getAllCharacteristics();
    this.loadEquipements();
  }

  ngAfterViewInit(): void {
    this.initMap();
    
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
    }
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([36.8065, 10.1815], {
      draggable: true,
      icon: icon
    }).addTo(this.map);

    this.marker.bindPopup("<b>Position sélectionnée</b><br>").openPopup();

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarkerPosition(e.latlng);
      this.reverseGeocode(e.latlng);
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.houseForm.patchValue({
        latitude: position.lat,
        longitude: position.lng
      });
      this.reverseGeocode(position);
    });

    this.houseForm.patchValue({
      latitude: 36.8065,
      longitude: 10.1815
    });
  }

  private updateMarkerPosition(latlng: L.LatLng): void {
    this.marker.setLatLng(latlng);
    this.houseForm.patchValue({
      latitude: latlng.lat,
      longitude: latlng.lng
    });
  }

  private reverseGeocode(latlng: L.LatLng): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;
    
    fetch(url)
      .then(response => response.json())
      .then((data: NominatimResponse) => {
        this.selectedAddress = data.display_name || 'Adresse non trouvée';
        
        // Mettre à jour à la fois l'affichage et le formulaire
        this.houseForm.patchValue({
          location: data.display_name
        });
        
        if (data.address?.postcode) {
          this.houseForm.patchValue({
            poste_code: data.address.postcode
          });
        }
      })
      .catch(error => {
        console.error('Erreur de géocodage inverse:', error);
        this.selectedAddress = 'Erreur lors de la récupération de l\'adresse';
      });
  }

  locateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
          this.updateMarkerPosition(userLocation);
          this.reverseGeocode(userLocation);
          this.map.setView(userLocation, 15);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur de géolocalisation',
            text: 'Impossible de récupérer votre position. Veuillez vérifier les permissions de localisation.'
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Géolocalisation non supportée',
        text: 'Votre navigateur ne supporte pas la géolocalisation.'
      });
    }
  }

  deletePic(picture: Picture): void {
    this.pictureArray = this.pictureArray.filter(pic => pic !== picture);
  }

  getAllCharacteristics(): void {
    this.characteristicService.getCharacteristics().subscribe({
      next: (data) => {
        this.characteristics = data.map(char => ({ ...char, quantite: 0 }));
      },
      error: (err) => console.error('Erreur chargement caractéristiques:', err)
    });
  }

  loadEquipements(): void {
    this.equipementService.getEquipements().subscribe({
      next: (data) => {
        this.equipements = data.map(equip => ({ ...equip, quantite: 0 }));
      },
      error: (err) => console.error('Erreur chargement équipements:', err)
    });
  }

  picked(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        this.handleInputChange(file);
      }
    }
  }

  handleInputChange(file: File): void {
    const pattern = /image-*/;
    const reader = new FileReader();
  
    if (!file.type.match(pattern)) {
      alert('Format d\'image invalide');
      return;
    }
  
    reader.onloadend = (e: any) => {
      const imageUrl = e.target.result;
  
      const exists = this.pictureArray.some(picture => picture.url === imageUrl);
      if (exists) {
        alert('Cette image est déjà ajoutée !');
        return;
      }
  
      const picture: Picture = {
        url: imageUrl,
        defaults: this.pictureArray.length === 0
      };
  
      this.pictureArray.push(picture);
    };
  
    reader.readAsDataURL(file);
  }

  getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  onSubmit(): void {
    if (this.houseForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Avertissement!', text: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    
    if (this.pictureArray.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Avertissement!', text: 'Ajoutez au moins une image.' });
      return;
    }

    const formData = {
      ...this.houseForm.value,
      pictures: this.pictureArray.map(pic => ({ url: pic.url, defaults: pic.defaults })),
      characteristics: this.arrayDetails
        .filter((item: any) => item.characteristicId)
        .map((item: any) => ({ 
          characteristicId: item.characteristicId, 
          quantite: item.quantite 
        })),
      Equipment: this.arrayDetails
        .filter((item: any) => item.equipementId)
        .map((item: any) => ({ 
          equipementId: item.equipementId, 
          quantite: item.quantite 
        })),
      userId: Number(this.getCookie("id")),
      active: true
    };

    this.houseService.createHouse(formData).subscribe({
      next: (data) => {
        Swal.fire({ icon: 'success', title: 'Succès!', text: 'Immobilier ajouté avec succès!' }).then(() => {
          this.router.navigate(['/house']);
        });
      },
      error: (err) => {
        console.error('Erreur:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Une erreur est survenue lors de l\'ajout d\'immobilier!' });
      }
    });
  }

  onSelectCharacteristic(event: Event, characteristic: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      this.arrayDetails.push({ 
        characteristicId: characteristic.id, 
        quantite: characteristic.quantite || 1 
      });
    } else {
      this.arrayDetails = this.arrayDetails.filter(
        (item: any) => !(item.characteristicId === characteristic.id)
      );
    }
  }

  onSelectEquipement(event: Event, equipement: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      this.arrayDetails.push({ 
        equipementId: equipement.id, 
        quantite: equipement.quantite || 1 
      });
    } else {
      this.arrayDetails = this.arrayDetails.filter(
        (item: any) => !(item.equipementId === equipement.id)
      );
    }
  }

  onQuantityChange(type: string, id: number, event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber || 1;
    
    const item = this.arrayDetails.find((item: any) => 
      (type === 'characteristic' && item.characteristicId === id) ||
      (type === 'equipement' && item.equipementId === id)
    );
    
    if (item) {
      item.quantite = value;
    }
  }
}