import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationModule } from './reservation/reservation.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotificationComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    RouterModule,
    HttpClientModule,
    ReservationModule,
  ],
  providers: [
    provideHttpClient(withFetch()), // Activation de fetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
