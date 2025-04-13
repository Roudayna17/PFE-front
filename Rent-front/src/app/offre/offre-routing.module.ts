import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOffreComponent } from './add-offre/add-offre.component';
import { UpdateOffreComponent } from './update-offre/update-offre.component';
import { DeleteOffreComponent } from './delete-offre/delete-offre.component';
import { ListOffreComponent } from './list-offre/list-offre.component';

const routes: Routes = [ { 
  path: '', redirectTo: 'list-offre', pathMatch: 'full' },
   // Redirection vers la liste 
          { path: 'add-offre', component: AddOffreComponent },
          { path: 'update-offre/:id', component: UpdateOffreComponent },
          { path: 'delete-offre', component: DeleteOffreComponent },
          { path: 'list-offre', component: ListOffreComponent },

    
    
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreRoutingModule { }
