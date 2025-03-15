import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaracteristiqueRoutingModule } from './caracteristique-routing.module';
import { AddCaracteristiqueComponent } from './add-caracteristique/add-caracteristique.component';
import { UpdateCaracteristiqueComponent } from './update-caracteristique/update-caracteristique.component';
import { DeleteCaracteristiqueComponent } from './delete-caracteristique/delete-caracteristique.component';
import { HttpClientModule } from '@angular/common/http';
import { ListCaracteristiqueComponent } from './list-caracteristique/list-caracteristique.component';

@NgModule({
  declarations: [
    AddCaracteristiqueComponent,
    UpdateCaracteristiqueComponent,
    ListCaracteristiqueComponent,
    DeleteCaracteristiqueComponent
  ],
  imports: [
    CommonModule,
    CaracteristiqueRoutingModule, // Import unique
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class CaracteristiqueModule { }
