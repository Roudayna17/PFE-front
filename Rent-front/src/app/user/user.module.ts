import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserADDComponent } from './user-add/user-add.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import {ListUserComponent } from './user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    UserADDComponent,
    UserUpdateComponent,
    UserDeleteComponent,
    ListUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule
  ]
})
export class UserModule { }
