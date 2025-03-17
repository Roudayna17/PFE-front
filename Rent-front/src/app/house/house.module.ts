import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseRoutingModule } from './house-routing.module';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddComponent,
    UpdateComponent,
    DeleteComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HouseRoutingModule,ReactiveFormsModule,FormsModule
  ]
})
export class HouseModule { }
