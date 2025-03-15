import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from '../auth.service';
import { Login } from '../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showError: boolean = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    const loginUser: Login = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
    };

    this.authService.loginUser(loginUser).subscribe({
      next: (data) => {
        console.log(data["user"])
        if (data["user"].role === 'admin') {
          this.storeCredentials(data);
          this.router.navigateByUrl('/dashboard'); // Redirige vers la page principale
        } else {
          this.showError = true;
          this.message = 'Vous n\'êtes pas un super utilisateur.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.showError = true;
        this.message = 'Erreur de connexion. Veuillez réessayer.';
        this.isLoading = false;
      },
    });
  }

  storeCredentials(user: any): void {
    localStorage.setItem('token', user.access_token);
    localStorage.setItem('id', user.userId);
    document.cookie = `token=${user.access_token}; Max-Age=${user.expiresIn}; path=/`;
  }
}