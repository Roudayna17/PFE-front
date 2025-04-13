import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationService } from '../../notification/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit, OnDestroy   {
  criteresMenuOpen = false;
  private countSubscription: Subscription | undefined;
  unreadCount: number | undefined;
  toggleCriteresMenu() {
    this.criteresMenuOpen = !this.criteresMenuOpen;
  }
  constructor( private router:Router,    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.countSubscription = this.notificationService.getFeedbackCount().subscribe(
      count => this.unreadCount = count,
      error => console.error('Error loading notification count', error)
    );
  }

  ngOnDestroy(): void {
    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
    }
  }

  deleteAllCookies(): void {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
  logout() {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, me déconnecter",
      cancelButtonText: "Annuler",
      buttonsStyling: false, // Désactive le style par défaut
      customClass: {
        container: '!font-sans', // Police cohérente
        popup: '!rounded-lg !shadow-xl', // Arrondis et ombre
        confirmButton: `
          !bg-purple-600 !hover:bg-purple-700 
          !text-white !font-medium 
          !py-2 !px-4 !rounded-lg 
          !transition-colors !duration-200
          !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !focus:ring-opacity-50
        `,
        cancelButton: `
          !bg-gray-200 !hover:bg-gray-300 
          !text-gray-800 !font-medium 
          !py-2 !px-4 !rounded-lg !ml-3
          !transition-colors !duration-200
          !focus:outline-none !focus:ring-2 !focus:ring-gray-500 !focus:ring-opacity-50
        `,
        actions: '!mt-4 !flex !justify-end' // Alignement des boutons
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAllCookies();
        this.router.navigateByUrl('/auth/login');
        Swal.fire({
          title: "Déconnecté",
          text: "Vous avez été déconnecté avec succès.",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: '!bg-green-600 !hover:bg-green-700 !text-white !font-medium !py-2 !px-4 !rounded-lg'
          }
        });
      }
    });
  }

}
