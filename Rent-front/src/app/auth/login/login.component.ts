import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from '../auth.service';
import { Login } from '../auth';
import Swal from 'sweetalert2';

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
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 24)
    this.authService.loginUser(loginUser).subscribe({
      next: (data) => {
      let user=data["user"]
        if (data["user"].role === 'admin') {
          this.storeCredentials(data);
          this.router.navigateByUrl('/dashboard'); 
          document.cookie = `firstName=${encodeURIComponent(user.firstName)}; expires=${expireDate.toUTCString()}; path=/`;
  document.cookie = `lastName=${encodeURIComponent(user.lastName)}; expires=${expireDate.toUTCString()}; path=/`;
  document.cookie = `id=${user.id}; expires=${expireDate.toUTCString()}; path=/`;
  document.cookie = `email=${encodeURIComponent(user.email)}; expires=${expireDate.toUTCString()}; path=/`;
  document.cookie = `token=${encodeURIComponent(user.data["access_token"])}; expires=${expireDate.toUTCString()}; path=/`;

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
  openForgotPasswordPopup(event: Event) {
    event.preventDefault(); // Évite le rechargement de la page
    
    Swal.fire({
      title: 'Réinitialiser le mot de passe',
      text: 'Comment souhaitez-vous recevoir le code de réinitialisation ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Par Email',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendResetCode(); // Envoi du code
      }
    });
  }

  sendResetCode() {
    // 🔴 Simuler l'envoi du code (Remplace ceci par un appel API réel)
    console.log("Envoi du code de réinitialisation...");

    Swal.fire({
      title: 'Vérifiez votre boîte mail',
      text: 'Un code de réinitialisation a été envoyé à votre adresse e-mail.',
      icon: 'success',
      confirmButtonText: 'Entrer le code'
    }).then(() => {
      this.enterVerificationCode();
    });
  }

  enterVerificationCode() {
    Swal.fire({
      title: 'Entrer le code de vérification',
      input: 'text',
      inputPlaceholder: 'Entrez le code reçu par e-mail',
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      preConfirm: (code) => {
        if (!code) {
          Swal.showValidationMessage('Le code ne peut pas être vide.');
        }
        return code; // Retourner le code saisi
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.verifyCode(result.value);
      }
    });
  }

  verifyCode(enteredCode: string) {
    const correctCode = "123456"; // 🔴 Ici, il faut comparer avec le vrai code reçu par email

    if (enteredCode === correctCode) {
      Swal.fire({
        title: 'Code correct !',
        text: 'Vous pouvez maintenant réinitialiser votre mot de passe.',
        icon: 'success',
        confirmButtonText: 'Changer le mot de passe'
      }).then(() => {
        // 🔴 Rediriger vers la page de réinitialisation du mot de passe
        console.log("Redirection vers la page de changement de mot de passe...");
      });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Le code que vous avez saisi est incorrect.',
        icon: 'error',
        confirmButtonText: 'Réessayer'
      }).then(() => {
        this.enterVerificationCode(); // Redemander le code
      });
    }
  }
}
