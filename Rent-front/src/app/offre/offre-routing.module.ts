import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOffreComponent } from './add-offre/add-offre.component';

const routes: Routes = [ { 
  path: '', redirectTo: 'add-offre', pathMatch: 'full' }, // Redirection vers la liste des locataires
      { path: 'add-offre', component: AddOffreComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreRoutingModule { }
