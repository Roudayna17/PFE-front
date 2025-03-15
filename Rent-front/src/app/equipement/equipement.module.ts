import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Ajoutez cette ligne
import {  ReactiveFormsModule } from '@angular/forms';

import { EquipementRoutingModule } from './equipement-routing.module';
import { AddEquipemntComponent } from './add-equipemnt/add-equipemnt.component';
import { UpdateEquipemntComponent } from './update-equipemnt/update-equipemnt.component';
import { ListEquipemntComponent } from './list-equipemnt/list-equipemnt.component';
import { DeleteEquipemntComponent } from './delete-equipemnt/delete-equipemnt.component';


@NgModule({
  declarations: [
    AddEquipemntComponent,
    UpdateEquipemntComponent,
    ListEquipemntComponent,
    DeleteEquipemntComponent
  ],
  imports: [
    CommonModule,
    EquipementRoutingModule,FormsModule,ReactiveFormsModule
  ]
})
export class EquipementModule { }
