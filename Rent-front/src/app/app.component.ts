import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { tokenGetter } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front';
  showMenu: boolean=false;
constructor(private router:Router)
{}
  ngOnInit() {
    if (typeof window !== 'undefined') {
          initFlowbite();
      }
      if (tokenGetter().length == 0) {
        this.router.navigate(['/auth/login']);
    }
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        if (event.url === '/auth/login')
    {
          this.showMenu = false;
        } else {
          this.showMenu = true;
        }
      }
    });
  }
}
