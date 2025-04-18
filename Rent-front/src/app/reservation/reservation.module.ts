import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ReservationRoutingModule } from './reservation-routing.module';

@NgModule({
  declarations: [ReservationComponent],
  imports: [
    CommonModule,ReservationRoutingModule 
  ],
  exports: [ReservationComponent] // Add this if you need to use the component in other modules
})
export class ReservationModule { }