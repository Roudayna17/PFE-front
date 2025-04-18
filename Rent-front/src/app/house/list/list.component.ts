import { Component, OnInit } from '@angular/core';
import { HouseService } from '../house.service';
import { House } from '../house';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EquipementService } from '../../equipement/equipement.service';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  selectedHouse: any = null;
  isModalOpen: boolean = false;
  close: boolean = false;
  selectedhouses: any = [];
  houses: any;
  filteredHouses: any = [];
  selectAll: boolean = false;
  isButtonDisabled: boolean = true;
  loadHouses: any;
  selectedHouses: any;
  allCharacteristics: any;
  allEquipments: any;
  searchTerm: string = '';

  constructor(
    private houseService: HouseService,
    private router: Router,
    private equipementService: EquipementService,
    private caracteristiqueService: CaracteristiqueService
  ) {}

  ngOnInit(): void {
    this.loadHouse();
    this.loadCharacteristics();
    this.loadEquipments();
  }

  loadHouse() {
    this.houseService.getAllHouses().subscribe(data => {
      console.log("📦 Données reçues :", data);
      this.houses = data;
      this.filteredHouses = [...this.houses];
  
      if (!this.houses || this.houses.length === 0) {
        console.log("⚠️ Aucune maison trouvée.");
        return;
      }
  
      this.houses.forEach((house: any) => {
        house.pictures = house.pictures || [];
        house.selected = false;
      });
    }, error => {
      console.error("❌ Erreur lors du chargement des maisons :", error);
    });
  }

  getCharacteristicImage(id: number): string | null {
    const char = this.allCharacteristics?.find((c: any) => c.id === id);
    return char?.image || null;
  }
  
  getEquipmentImage(id: number): string | null {
    const eq = this.allEquipments?.find((e: any) => e.id === id);
    return eq?.image || null;
  }
  loadCharacteristics() {
    this.caracteristiqueService.getCharacteristics().subscribe(data => {
      this.allCharacteristics = data;
    });
  }

  loadEquipments() {
    this.equipementService.getEquipements().subscribe(data => {
      this.allEquipments = data;
    });
  }

  filterHouses() {
    if (!this.searchTerm) {
      this.filteredHouses = [...this.houses];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredHouses = this.houses.filter((house: any) => {
      const titleMatch = house.title?.toLowerCase().includes(term);
      const lessorMatch = house.user 
        ? `${house.user.firstName} ${house.user.lastName}`.toLowerCase().includes(term)
        : false;
      return titleMatch || lessorMatch;
    });
  }
  clearSearch() {
    this.searchTerm = '';
    this.filterHouses();
  }

  goToAddOffer(houseId: number) {
    this.router.navigate(['/offre/add-offre'], { queryParams: { houseId: houseId } });
  }

viewDetails(house: any) {
  this.houseService.getHouseById(house.id).subscribe(
    (data) => {
      this.selectedHouse = data;
      console.log(' House details:', data);
      
      if (this.selectedHouse.characteristics) {
        this.selectedHouse.characteristics.forEach((char: any) => {
          char.title = this.getCharacteristicName(char.caracteristiqueId);
          char.image = this.getCharacteristicImage(char.caracteristiqueId);
        });
      }
      
      if (this.selectedHouse.Equipment) {
        this.selectedHouse.Equipment.forEach((eq: any) => {
          eq.title = this.getEquipmentName(eq.equipementId);
          eq.image = this.getEquipmentImage(eq.equipementId);
        });
      }
      
      this.isModalOpen = true;
    },
    (error) => {
      console.error("Erreur lors du chargement des détails de la maison", error);
    }
  );
}

getCharacteristicName(id: number): string {
  if (!this.allCharacteristics) return 'Chargement...';
  const char = this.allCharacteristics.find((c: any) => c.id === id);
  return char ? char.title : `Caractéristique #${id}`; // Utilisez 'title' au lieu de 'name'
}

getEquipmentName(id: number): string {
  const eq = this.allEquipments?.find((e: any) => e.id === id);
  return eq ? eq.title : 'Équipement inconnu'; 
}
  
  actionClose() {
    this.close = false;
  }

  actionSave() {
    const idsToDelete = this.selectedhouses.map((house: any) => house.id);
    if (idsToDelete.length === 0) {
      Swal.fire('Erreur', 'Veuillez sélectionner au moins une maison à supprimer', 'warning');
      return;
    }

    this.houseService.deleteMultiple(idsToDelete).subscribe(
      response => {
        Swal.fire('Succès', 'Les maisons ont été supprimées avec succès', 'success');
        this.loadHouse();
        this.close = false;
      },
      error => {
        console.error(error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression des maisons', 'error');
      }
    );
  }

  actionOpen() {
    this.close = true;
    console.log("close", this.close);
  }

  toggleSelectAll() {
    this.houses.forEach((house: any) => (house.selected = this.selectAll));
    this.onCheckboxChange();
  }
  
  onCheckboxChange() {
    this.selectedhouses = this.houses.filter((house: any) => house.selected);
    this.isButtonDisabled = this.selectedhouses.length === 0;
  }

  editRouter() {
    const selectedIds = this.selectedhouses.map((house: any) => house.id);
    if (selectedIds.length === 1) {
      this.router.navigate(['/house/update', selectedIds[0]]);
    } else {
      console.log('Modifier les immobiliers sélectionnés:', selectedIds);
    }
  }
  
}