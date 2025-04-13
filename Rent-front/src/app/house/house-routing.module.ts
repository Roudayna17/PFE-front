import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'add', component: AddComponent,canActivate: [AuthGuard] },
  { path: 'update/:id', component: UpdateComponent ,canActivate: [AuthGuard]}, 
  { path: 'delete/:id', component: DeleteComponent ,canActivate: [AuthGuard]}, 
  { path: 'list', component: ListComponent,canActivate: [AuthGuard] },
  { path: '', redirectTo: 'list', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'list' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
