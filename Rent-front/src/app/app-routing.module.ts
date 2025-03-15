import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:"user",loadChildren:()=>import('./user/user.module').then(m=>m.UserModule)
},
{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
{ path: 'locataire', loadChildren: () => import('./locataire/locataire.module').then(m => m.LocataireModule) },
  {path:"lessor",loadChildren:()=>import('./lessor/lessor.module').then(m=>m.LessorModule)},
  {path:"equipement",loadChildren:()=>import('./equipement/equipement.module').then(m=>m.EquipementModule)},
  {
    path: 'caracteristique',
    loadChildren: () => import('./caracteristique/caracteristique.module').then(m => m.CaracteristiqueModule)
  },
    {path: 'house', loadChildren: () => import('./house/house.module').then(m => m.HouseModule)} ,
  {path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)} ,
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)} ,
  {path: 'offre', loadChildren: () => import('./offre/offre.module').then(m => m.OffreModule)} 

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
