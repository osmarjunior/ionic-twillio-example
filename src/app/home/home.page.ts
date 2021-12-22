import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  server_add: any = 'http://192.168.1.75:8080'
  name: string;

  constructor(private router: Router) {
  }

  connectTele() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: this.name,
        server_add: this.server_add
      }
    };
    this.router.navigate(['/video'], navigationExtras);
  }
}
