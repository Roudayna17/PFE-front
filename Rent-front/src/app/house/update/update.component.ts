import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '../house.service';
import { EquipementService } from '../../equipement/equipement.service';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;
  msg: string = '';
  show: boolean = false;
  showError: boolean = false;
  houseForm!: FormGroup;
  characteristics: any;
  equipements: any;
  pictures: any = [];
  arrayCharacteristics: any[] = [];
  arrayEquipements: any[] = [];
  pictureArray: any[] = [];
  houseId!: number; // To identify the house being updated
  desableDefCheck!: boolean;
  alert!: string;
  tailleInvalid: boolean = false;
  filesize!: number;
  filename!: string;

  constructor(
    private fb: FormBuilder,
    private houseService: HouseService,
    private equipementService: EquipementService,
    private characteristicService: CaracteristiqueService,
    private router: Router,
    private route: ActivatedRoute // To get route parameters
  ) {
    this.houseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
      city: ['', Validators.required],
      poste_code: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
      price: [0, [Validators.required, Validators.min(0)]],
      availability: [null],
      equipments: this.fb.array([]),
      characteristics: this.fb.array([]),
      pictures: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.houseId = params['id']; // Get the house ID from the route
      this.loadHouseDetails(this.houseId); // Load house data for update
    });

    this.getAllCharacteristics();
    this.loadEquipements();
  }

  loadHouseDetails(id: number): void {
    this.houseService.getHouseById(id).subscribe(
      (data:any) => {
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

        // Prepopulate the arrays
        this.houseForm.setControl('characteristics', this.fb.array(this.arrayCharacteristics));
        this.houseForm.setControl('equipments', this.fb.array(this.arrayEquipements));
        this.houseForm.setControl('pictures', this.fb.array(this.pictureArray));
      },
      (error:any) => {
        console.error('Error loading house details:', error);
      }
    );
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
  loadEquipements() {
    this.equipementService.getEquipements().subscribe(
      (data) => {
        this.equipements = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des équipements', error);
      }
    );
  }

  onSelect(event: Event): void {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    this.arrayCharacteristics = Array.from(selectedOptions).map((option: any) => option.value);
    console.log('Selected Characteristics:', this.arrayCharacteristics);
  }

  onSelectEquipement(event: Event): void {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    this.arrayEquipements = Array.from(selectedOptions).map((option: any) => option.value);
    console.log('Selected Equipments:', this.arrayEquipements);
  }

  /* Image Upload Logic (as in your original code) */

  picked(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.filename = file.name;
      this.filesize = file.size;
      if (this.filesize > 100000) {
        this.tailleInvalid = true;
        return;
      }
      this.tailleInvalid = false;
      this.handleInputChange(file);
    } else {
      alert('No file selected');
    }
  }

  handleInputChange(files: File) {
    var file = files;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.alert = "format d'image invalide ";
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  async _handleReaderLoaded(e: any) {
    let allpicture: any = { url: await e.target.result, defaults: false };
    this.pictureArray.push(allpicture);
    console.log('this.pictureArray', this.pictureArray);
    const found = this.pictureArray.filter((item: { defaults: any }) => item.defaults === true);
    if (found.length == 0) {
      this.pictureArray[0].defaults = true;
    }
    this.desableDefCheck = false;
  }

  async deletePicAction(item: any) {
    var pos = this.pictureArray.indexOf(item);
    this.pictureArray.splice(pos, 1);
    if (item.defaults == true && this.pictureArray.length > 0) {
      this.pictureArray[0].defaults = true;
    }
  }

  /* Submission Logic for Update */

  onSubmit(): void {
    const updatedHouse = {
      ...this.houseForm.value,
      characteristics: this.arrayCharacteristics,
      equipments: this.arrayEquipements,
      pictures: this.pictureArray,
    };

    console.log('Updated House Data:', updatedHouse);

    this.houseService.updateHouse(this.houseId, updatedHouse).subscribe(
      () => {
        this.msg = 'House updated successfully';
        this.show = true;
        this.showError = false;
      },
      (err: any) => {
        console.error('Error updating house:', err);
        this.msg = 'Error updating house';
        this.show = false;
        this.showError = true;
      }
    );
  }

  back(): void {
    this.router.navigate(['/locataire']);
  }

  finishStepper(): void {
    this.isFinalStep = true;
  }
}
