import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffreRoutingModule } from './offre-routing.module';
import { AddOffreComponent } from './add-offre/add-offre.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddOffreComponent
  ],
  imports: [
    CommonModule,
    OffreRoutingModule,ReactiveFormsModule
  ]
})
export class OffreModule { }
