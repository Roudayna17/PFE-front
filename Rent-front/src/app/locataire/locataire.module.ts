import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocataireRoutingModule } from './locataire-routing.module';
import { AddLocataireComponent } from './add-locataire/add-locataire.component';
import { UpdateLocataireComponent } from './update-locataire/update-locataire.component';
import { ListLocataireComponent } from './list-locataire/list-locataire.component';
import { DeleteLocataireComponent } from './delete-locataire/delete-locataire.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AddLocataireComponent,
    UpdateLocataireComponent,
    ListLocataireComponent,
    DeleteLocataireComponent
  ],
  imports: [
    CommonModule,
    LocataireRoutingModule,
    FormsModule,
    ReactiveFormsModule,HttpClientModule
  ]
})
export class LocataireModule { }
