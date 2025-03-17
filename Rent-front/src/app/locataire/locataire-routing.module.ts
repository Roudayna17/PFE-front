import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLocataireComponent } from './add-locataire/add-locataire.component';
import { UpdateLocataireComponent } from './update-locataire/update-locataire.component';
import { ListLocataireComponent } from './list-locataire/list-locataire.component';
import { DeleteLocataireComponent } from './delete-locataire/delete-locataire.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-locataire', pathMatch: 'full' }, // Redirection vers la liste des locataires
  { path: 'add-locataire', component: AddLocataireComponent },
  { path: 'update-locataire/:id', component: UpdateLocataireComponent }, // Ajout de ":id" pour identifier le locataire à modifier
  { path: 'list-locataire', component: ListLocataireComponent },
  { path: 'delete-locataire/:id', component: DeleteLocataireComponent } // Ajout de ":id" pour spécifier le locataire à supprimer
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocataireRoutingModule { }
