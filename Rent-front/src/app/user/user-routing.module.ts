import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserADDComponent } from './user-add/user-add.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { ListUserComponent } from './user-list/user-list.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
const routes: Routes = [
  { path: '', redirectTo: 'list-user', pathMatch: 'full' }, // Correction ici
  { path: 'add-user', component: UserADDComponent },
  { path: 'update-user/:id', component: UserUpdateComponent },
  { path: 'list-user', component: ListUserComponent },
  { path: 'delete-user', component: UserDeleteComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
