import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'qrcodeauth.page.html',
  styleUrls: ['qrcodeauth.page.scss']
})
export class QrCodeAuth implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }

  iniciarAtendimento() {
    this.router.navigate(['/qr-scanner']);
  }
}
