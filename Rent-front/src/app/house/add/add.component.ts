import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../house.service';
import { Router } from '@angular/router';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';
import { EquipementService } from '../../equipement/equipement.service';
import { Picture } from '../house';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  arrayDetails: any=[];
 
  
  houseForm: FormGroup;
  characteristics: any[] = [];
  equipements: any[] = [];
  pictureArray: Picture[] = [];
  arrayCharacteristics: { id: number; quantite: number }[] = [];
  arrayEquipements: { id: number; quantite: number }[] = [];
  houseId!: number;
 quantityCharat:number=0
  constructor(
    private fb: FormBuilder,
    private houseService: HouseService,
    private router: Router,
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
      pictures: [],
      lessorId:[],
      userId:[],
      active:[true]
    });
  }

  ngOnInit(): void {
    this.getAllCharacteristics();
    this.loadEquipements();
    
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

  onSelectCharacteristic(event: Event, characteristic: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
      const quantite = characteristic.quantite || 0; // Assure-toi que la quantité soit initialisée à 0 si elle est absente.

    if (isChecked) {
      this.arrayDetails.push({ characteristicId: characteristic.id, quantite: characteristic.quantite  });
    } else {
      this.arrayDetails = this.arrayDetails.filter((c:any) => c.characteristicId !== characteristic.id);
    }
    console.log("house details",this.arrayDetails)
  }

  onSelectEquipement(event: Event, equipement: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const quantite = equipement.quantite || 0; // Assure-toi que la quantité soit initialisée à 0 si elle est absente.

    if (isChecked) {
      this.arrayDetails.push({ equipementId: equipement.id, quantite: equipement.quantite });
    } else {
      this.arrayDetails = this.arrayDetails.filter((e:any) => e.equipementId !== equipement.id);
    }
  }

  onQuantityChange(type: string, id: number, event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    if (type === 'characteristic') {
      const item = this.arrayCharacteristics.find((c:any) => c.characteristicId === id);
      if (item) item.quantite = value;
    } else if (type === 'equipement') {
      const item = this.arrayEquipements.find((e:any) => e.equipementId === id);
      if (item) item.quantite = value;
    }
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
      alert('Format d\'image invalide');
      return;
    }
  
    reader.onloadend = (e: any) => {
      const imageUrl = e.target.result;
  
      // Vérifier si l'image existe déjà dans pictureArray
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
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
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

    if (this.arrayDetails.length === 0 ) {
      Swal.fire({ icon: 'warning', title: 'Avertissement!', text: 'Sélectionnez au moins une caractéristique et un équipement.' });
      return;
    }

    this.houseForm.value.characteristics = this.arrayCharacteristics;
   this.houseForm.value.equipements = this.arrayEquipements;
    this.houseForm.value.pictures = this.pictureArray;
    this.houseForm.value.userId=Number(this.getCookie("id"))

    this.houseService.createHouse(this.houseForm.value).subscribe({
      next: (data) => {
        this.pictureArray.forEach(async picture => {
          picture.HouseId = data.id
          console.log('picture',picture)
          await this.houseService.addPicture(picture)
            .subscribe(
              picture => {
                console.log("picture",picture)
              })
            })
        Swal.fire({ icon: 'success', title: 'Succès!', text: 'Immobilier ajouté avec succès!' }).then(() => {
          this.router.navigate(['/house']);
        });
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Une erreur est survenue lors de l\'ajout d\'immobilier!' });
      }
    });
  }
}
