import { Component, OnInit } from '@angular/core';
import { HouseService } from '../house.service';
import { House } from '../house';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipementService } from '../../equipement/equipement.service';
import { CaracteristiqueService } from '../../caracteristique/caracteristique.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  close: boolean=false;
  selectedhouses:any=[]
  houses:any
  selectAll: boolean = false;
  isButtonDisabled: boolean = true;

  constructor(
    private houseService: HouseService,  private router:Router

  ) {

  }

  ngOnInit(): void {
 this.loadHouse()
  }
  loadHouse(){
    this.houseService.getAllHouses().subscribe(data=>{
      this.houses=data[0]
      console.log("house",data)
      })
  }
  actionClose(){
    this.close=false
  }
  actionSave(){
    this.close=false
    this.loadHouse()
  }
  actionOpen(){
    this.close=true
    console.log("close", this.close)
   
  }
  toggleSelectAll() {
    this.houses.forEach((house:any) => (house.selected = this.selectAll));
    this.onCheckboxChange();
  }
  onCheckboxChange(){
    this.selectedhouses = this.houses.filter((house:any) => house.selected);
    this.isButtonDisabled = this.selectedhouses.length === 0;

  }
  editRouter() {
    const selectedIds = this.selectedhouses.map((house:any) => house.id);
    if (selectedIds.length === 1) {
      this.router.navigate(['/house/update', selectedIds[0]]);
    } else {
      console.log('Modifier les équipements sélectionnés:', selectedIds);
    }
  }
}