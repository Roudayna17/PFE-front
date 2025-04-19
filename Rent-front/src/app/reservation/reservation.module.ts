import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReservationComponent],
  imports: [
    CommonModule,ReservationRoutingModule ,FormsModule

  ],
  exports: [ReservationComponent] // Add this if you need to use the component in other modules
})
export class ReservationModule { }