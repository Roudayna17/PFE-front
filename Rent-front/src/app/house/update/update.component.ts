import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  houseForm: FormGroup;
  characteristics: any[] = [];
  equipements: any[] = [];
  pictureArray: any[] = [];
  arrayCharacteristics: number[] = [];
  arrayEquipements: number[] = [];
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
      location: ['', Validators.required],
      city: ['', Validators.required],
      poste_code: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
      price: [0, [Validators.required, Validators.min(0)]],
      availability: [null],
      characteristics: [[]],
      equipments: [[]],
      pictures: [[]]
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
        this.houseForm.patchValue({
          title: data.title,
          description: data.description,
          location: data.location,
          city: data.city,
          poste_code: data.poste_code,
          price: data.price,
          availability: data.availability,
        });

        this.arrayCharacteristics = data.characteristics.map((c: any) => c.id);
        this.arrayEquipements = data.equipments.map((e: any) => e.id);
        this.pictureArray = data.pictures;
      },
      error: (err) => {
        console.error('Error loading house details:', err);
      }
    });
  }

  getAllCharacteristics(): void {
    this.characteristicService.getCharacteristics().subscribe({
      next: (data) => {
        this.characteristics = data;
      },
      error: (err) => {
        console.error('Error fetching characteristics:', err);
      }
    });
  }

  loadEquipements(): void {
    this.equipementService.getEquipements().subscribe({
      next: (data) => {
        this.equipements = data;
      },
      error: (err) => {
        console.error('Error fetching equipements:', err);
      }
    });
  }

  onSelectCharacteristic(event: Event, characteristicId: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.arrayCharacteristics.push(characteristicId);
    } else {
      const index = this.arrayCharacteristics.indexOf(characteristicId);
      if (index !== -1) {
        this.arrayCharacteristics.splice(index, 1);
      }
    }
  }

  onSelectEquipement(event: Event, equipmentId: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.arrayEquipements.push(equipmentId);
    } else {
      const index = this.arrayEquipements.indexOf(equipmentId);
      if (index !== -1) {
        this.arrayEquipements.splice(index, 1);
      }
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
      alert('Invalid image format');
      return;
    }
    reader.onloadend = (e: any) => {
      const picture = { url: e.target.result, defaults: this.pictureArray.length === 0 };
      this.pictureArray.push(picture);
    };
    reader.readAsDataURL(file);
  }

  deletePicAction(item: any): void {
    const index = this.pictureArray.indexOf(item);
    this.pictureArray.splice(index, 1);
    if (item.defaults && this.pictureArray.length > 0) {
      this.pictureArray[0].defaults = true;
    }
  }

  onSubmit(): void {
    this.houseForm.value.characteristics = this.arrayCharacteristics;
    this.houseForm.value.equipments = this.arrayEquipements;
    this.houseForm.value.pictures = this.pictureArray;

    this.houseService.updateHouse(this.houseId, this.houseForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'House updated successfully!',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/house']);
          }
        });
      },
      error: (err) => {
        console.error('Error updating house:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the house.',
        });
      }
    });
  }
}