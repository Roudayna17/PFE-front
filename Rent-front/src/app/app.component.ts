import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { tokenGetter } from './auth/auth.service';
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Inject } from "@angular/core";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front';
  showMenu: boolean=false;
constructor(private router:Router,
  @Inject(PLATFORM_ID) private platformId: object
)
{}
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Tout ce qui dépend du navigateur
    initFlowbite();
    document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('csrftoken');

    const token = tokenGetter(this.platformId);
    console.log("tokennnn", token);

    if (token.length === 0) {
      this.router.navigate(['/auth/login']);
    }

    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.showMenu = event.url !== '/auth/login';
      }
    });
  }
}
}