import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEquipemntComponent } from './add-equipemnt/add-equipemnt.component';
import { UpdateEquipemntComponent } from './update-equipemnt/update-equipemnt.component';
import { ListEquipemntComponent } from './list-equipemnt/list-equipemnt.component';
import { DeleteEquipemntComponent } from './delete-equipemnt/delete-equipemnt.component';

const routes: Routes = [
    { path: '', redirectTo: 'list-equipement', pathMatch: 'full' }, // Redirection vers la liste des locataires
    { path: 'add-equipement', component: AddEquipemntComponent },
    { path: 'update-equipement/:id', component: UpdateEquipemntComponent }, // Ajout de ":id" pour identifier le locataire à modifier
    { path: 'list-equipement', component: ListEquipemntComponent },
    { path: 'delete-equipement/:id', component: DeleteEquipemntComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipementRoutingModule { }
