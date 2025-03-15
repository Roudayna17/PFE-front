import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';  // Vérifie le chemin ici
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent], // Assurez-vous que l'élément racine de l'application est correctement bootstrapé
})
export class AppServerModule {}
