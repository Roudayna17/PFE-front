import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../house.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  houseForm: FormGroup;
  characteristics: any[] = [];
  equipements: any[] = [];
  pictureArray: Picture[] = [];
  arrayDetails: any[] = [];
  houseId!: number;
  selectedAddress: string = '';
  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private fb: FormBuilder,
    private houseService: HouseService,
    private router: Router,
    private route: ActivatedRoute,
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
      active: [true]
    });
  }

  ngOnInit(): void {
    this.houseId = this.route.snapshot.params['id'];
    this.loadHouseDetails(this.houseId);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 13
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

  loadHouseDetails(id: number): void {
    this.houseService.getHouseById(id).subscribe({
      next: (data) => {
        this.houseForm.patchValue({
          title: data.title,
          description: data.description,
          location: data.location,
          poste_code: data.poste_code,
          surface: data.surface,
          rooms: data.rooms,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          price: data.price,
          type: data.type,
          latitude: data.latitude || 36.8065,
          longitude: data.longitude || 10.1815,
          active: data.active
        });

        if (data.latitude && data.longitude) {
          const position = L.latLng(data.latitude, data.longitude);
          this.updateMarkerPosition(position);
          this.map.setView(position, 15);
          this.reverseGeocode(position);
        }

        this.pictureArray = data.pictures || [];
        this.arrayDetails = [];
        
        if (data.characteristics) {
          data.characteristics.forEach((char: any) => {
            this.arrayDetails.push({
              characteristicId: char.id,
              quantite: char.pivot?.quantite || 1
            });
          });
        }

        if (data.equipements) {
          data.equipements.forEach((equip: any) => {
            this.arrayDetails.push({
              equipementId: equip.id,
              quantite: equip.pivot?.quantite || 1
            });
          });
        }

        this.getAllCharacteristics();
        this.loadEquipements();
      },
      error: (err) => console.error('Erreur chargement immobilier:', err)
    });
  }

  getAllCharacteristics(): void {
    this.characteristicService.getCharacteristics().subscribe({
      next: (data) => {
        this.characteristics = data.map(char => {
          const existingDetail = this.arrayDetails.find(
            item => item.characteristicId === char.id
          );
          
          return {
            ...char,
            checked: !!existingDetail,
            quantite: existingDetail?.quantite || 1
          };
        });
      },
      error: (err) => console.error('Erreur chargement caractéristiques:', err)
    });
  }

  loadEquipements(): void {
    this.equipementService.getEquipements().subscribe({
      next: (data) => {
        this.equipements = data.map(equip => {
          const existingDetail = this.arrayDetails.find(
            item => item.equipementId === equip.id
          );
          
          return {
            ...equip,
            checked: !!existingDetail,
            quantite: existingDetail?.quantite || 1
          };
        });
      },
      error: (err) => console.error('Erreur chargement équipements:', err)
    });
  }

  onSelectCharacteristic(event: Event, characteristic: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    characteristic.checked = isChecked;
    
    if (isChecked) {
      const existingIndex = this.arrayDetails.findIndex(
        item => item.characteristicId === characteristic.id
      );
      
      if (existingIndex === -1) {
        this.arrayDetails.push({
          characteristicId: characteristic.id,
          quantite: characteristic.quantite || 1
        });
      }
    } else {
      this.arrayDetails = this.arrayDetails.filter(
        item => item.characteristicId !== characteristic.id
      );
    }
  }

  onSelectEquipement(event: Event, equipement: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    equipement.checked = isChecked;
    
    if (isChecked) {
      const existingIndex = this.arrayDetails.findIndex(
        item => item.equipementId === equipement.id
      );
      
      if (existingIndex === -1) {
        this.arrayDetails.push({
          equipementId: equipement.id,
          quantite: equipement.quantite || 1
        });
      }
    } else {
      this.arrayDetails = this.arrayDetails.filter(
        item => item.equipementId !== equipement.id
      );
    }
  }

  onQuantityChange(type: string, id: number, event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber || 1;
    
    if (type === 'characteristic') {
      const char = this.characteristics.find(c => c.id === id);
      if (char) {
        char.quantite = value;
        
        const existingIndex = this.arrayDetails.findIndex(
          item => item.characteristicId === id
        );
        
        if (existingIndex !== -1) {
          this.arrayDetails[existingIndex].quantite = value;
        } else {
          this.arrayDetails.push({
            characteristicId: id,
            quantite: value
          });
          char.checked = true;
        }
      }
    } 
    else if (type === 'equipement') {
      const equip = this.equipements.find(e => e.id === id);
      if (equip) {
        equip.quantite = value;
        
        const existingIndex = this.arrayDetails.findIndex(
          item => item.equipementId === id
        );
        
        if (existingIndex !== -1) {
          this.arrayDetails[existingIndex].quantite = value;
        } else {
          this.arrayDetails.push({
            equipementId: id,
            quantite: value
          });
          equip.checked = true;
        }
      }
    }
  }

  deletePic(picture: Picture): void {
    this.pictureArray = this.pictureArray.filter(pic => pic !== picture);
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
      active: this.houseForm.value.active
    };

    this.houseService.updateHouse(this.houseId, formData).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Succès!', text: 'Immobilier modifié avec succès!' }).then(() => {
          this.router.navigate(['/house']);
        });
      },
      error: (err) => {
        console.error('Erreur:', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Une erreur est survenue lors de la modification!' });
      }
    });
  }
}