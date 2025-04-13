import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '../user/user.module';
@NgModule({
  declarations: [
    LoginComponent,
  
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,FormsModule,ReactiveFormsModule
  ]

})
export class AuthModule { }
