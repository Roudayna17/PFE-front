import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'add', component: AddComponent },
  { path: 'update/:id', component: UpdateComponent }, 
  { path: 'delete/:id', component: DeleteComponent }, 
  { path: '', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/list' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessorRoutingModule { }
