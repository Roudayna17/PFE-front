import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCaracteristiqueComponent } from './add-caracteristique/add-caracteristique.component';
import { ListCaracteristiqueComponent} from './list-caracteristique/list-caracteristique.component'
import { UpdateCaracteristiqueComponent } from './update-caracteristique/update-caracteristique.component';
import { DeleteCaracteristiqueComponent } from './delete-caracteristique/delete-caracteristique.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
    { path: '', redirectTo: 'list-caracteristique', pathMatch: 'full' }, // Redirection vers la liste des locataires
    { path: 'add-caracteristique', component: AddCaracteristiqueComponent },
    { path: 'update-caracteristique/:id', component: UpdateCaracteristiqueComponent }, // Ajout de ":id" pour identifier le locataire à modifier
    { path: 'list-caracteristique', component: ListCaracteristiqueComponent },
    { path: 'delete-caracteristique/:id', component: DeleteCaracteristiqueComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaracteristiqueRoutingModule { }
