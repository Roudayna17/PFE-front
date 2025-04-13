import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffreRoutingModule } from './offre-routing.module';
import { AddOffreComponent } from './add-offre/add-offre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListOffreComponent } from './list-offre/list-offre.component';
import { UpdateOffreComponent } from './update-offre/update-offre.component';
import { DeleteOffreComponent } from './delete-offre/delete-offre.component';


@NgModule({
  declarations: [
    AddOffreComponent,
    ListOffreComponent,
    UpdateOffreComponent,
    DeleteOffreComponent
  ],
  imports: [
    CommonModule,
    OffreRoutingModule,ReactiveFormsModule,FormsModule
  ]
})
export class OffreModule { }
