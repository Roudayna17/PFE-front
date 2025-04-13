import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Picture } from '../house';
import { HouseService } from '../house.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';
import { EquipementService } from '../../equipement/equipement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
deletePicAction(_t113: any) {
throw new Error('Method not implemented.');
}

  houseForm: FormGroup;
  characteristics: any[] = [];
  equipements: any[] = [];
  pictureArray: any[] = [];
  arrayCharacteristics: { characteristicId: number; quantite: number }[] = [];
arrayEquipements: { equipementId: number; quantite: number }[] = [];
  houseId!: number;


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
      description: [''],
      city: ['', Validators.required],
      location: ['', Validators.required],
      poste_code: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
      surface:['', Validators.required],
      rooms:['', Validators.required],
      bedrooms:['', Validators.required],
      bathrooms:['', Validators.required],
      price: ['', Validators.required],     
      type: ['', Validators.required],
      characteristics: [],
      equipements: [],
      pictures: []
    });
  }

  ngOnInit(): void {
    this.houseId = this.route.snapshot.params['id'];
    this.loadHouseDetails(this.houseId);
    this.getAllCharacteristics();
    this.loadEquipements();
  }

  loadHouseDetails(id: number): void {
    this.houseService.getHouseById(id).subscribe({
      next: (data) => {
        console.log("data",data)
        this.houseForm.patchValue({
          title: data.title,
          description: data.description,
          location: data.location,
          city: data.city,
          poste_code: data.poste_code,
          surface:data.surface,
          rooms:data.rooms,
          bedrooms:data.bedrooms,
          bathrooms:data.bathrooms,
          price: data.price,
          type:data.type,
        });

        // Gestion des caractéristiques
      this.arrayCharacteristics = data.characteristics.map((char: any) => ({
        characteristicId: char.id,
        quantite: data.characteristicsQuantities?.[char.id] || 1
      }));

      // Gestion des équipements
      this.arrayEquipements = data.Equipment.map((equip: any) => ({
        equipementId: equip.id,
        quantite: data.equipementsQuantities?.[equip.id] || 1
      }));

      // Gestion des images
      this.pictureArray = data.pictures || [];
      // Charger les caractéristiques et équipements après avoir reçu les données de la maison
      this.getAllCharacteristics();
      this.loadEquipements();
      },
      error: (err) => console.error('Erreur chargement immobilier:', err)
    });
  }
 

// Mettez à jour getAllCharacteristics
getAllCharacteristics(): void {
  this.characteristicService.getCharacteristics().subscribe({
    next: (data) => {
      this.characteristics = data.map(char => {
        const existingChar = this.arrayCharacteristics.find(c => c.characteristicId === char.id);
        return {
          ...char,
          checked: !!existingChar,
          quantite: existingChar?.quantite || 0
        };
      });
    },
    error: (err) => console.error('Erreur chargement caractéristiques:', err)
  });
}
  deletePic(picture: Picture): void {
    this.pictureArray = this.pictureArray.filter(pic => pic !== picture);
  }


  // Mettez à jour loadEquipements
  loadEquipements(): void {
    this.equipementService.getEquipements().subscribe({
      next: (data) => {
        this.equipements = data.map(equip => {
          const existingEquip = this.arrayEquipements.find(e => e.equipementId === equip.id);
          return {
            ...equip,
            checked: !!existingEquip,
            quantite: existingEquip?.quantite || 0
          };
        });
      },
      error: (err) => console.error('Erreur chargement équipements:', err)
    });
  }


  picked(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size > 100000) {
          alert('File size exceeds 100KB');
          return;
        }
        this.handleInputChange(file);
      }
    }
  }
  handleInputChange(file: File): void {
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('Invalid image format');
      return;
    }
    reader.onloadend = (e: any) => {
      const picture: Picture = {
        url: e.target.result,
        defaults: this.pictureArray.length === 0
        
      };
      
      this.pictureArray.push(picture);
    };
    reader.readAsDataURL(file);
  }

  // Mettez à jour onSelectCharacteristic et onSelectEquipement
onSelectCharacteristic(event: Event, characteristic: any): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.arrayCharacteristics.push({ 
      characteristicId: characteristic.id, 
      quantite: characteristic.quantite || 1 
    });
  } else {
    this.arrayCharacteristics = this.arrayCharacteristics.filter(
      c => c.characteristicId !== characteristic.id
    );
  }
}

onSelectEquipement(event: Event, equipement: any): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.arrayEquipements.push({ 
      equipementId: equipement.id, 
      quantite: equipement.quantite || 1 
    });
  } else {
    this.arrayEquipements = this.arrayEquipements.filter(
      e => e.equipementId !== equipement.id
    );
  }
}
onQuantityChange(type: string, id: number, event: Event): void {
  const value = (event.target as HTMLInputElement).valueAsNumber;
  if (type === 'characteristic') {
    const item = this.arrayCharacteristics.find(c => c.characteristicId === id);
    if (item) {
      item.quantite = value;
      console.log('Updated characteristic:', item);
    }
  } else if (type === 'equipement') {
    const item = this.arrayEquipements.find(e => e.equipementId === id);
    if (item) {
      item.quantite = value;
      console.log('Updated equipement:', item);
    }
  }
}
  



  onSubmit(): void {
    this.houseForm.value.characteristics = this.arrayCharacteristics;
    this.houseForm.value.equipements = this.arrayEquipements;
    this.houseForm.value.pictures = this.pictureArray;

    this.houseService.updateHouse(this.houseId, this.houseForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Immobilier modifié avec succès!'
        }).then(() => {
          this.router.navigate(['/house']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la modification!'
        });
        console.error("Erreur lors de la mise à jour de la maison: ", err);
      }
    });
    
  }
}
