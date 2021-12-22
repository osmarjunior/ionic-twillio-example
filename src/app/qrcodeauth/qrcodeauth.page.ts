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

    /*var context = this;
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          console.log('Scanned something authorized');
          var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.httpClient.post(this.server_add + '/auth', JSON.stringify({uuid: text})).subscribe(
              resultado => {
                console.log(resultado)
              },
              erro => {
                  console.log(erro);
              }
            );

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            ionApp.style.display = "block";
          }, (error) => console.log('Error: ' + error), () => console.log('completed'));

          // show camera preview
          ionApp.style.display = "none";
          context.qrScanner.show();

          setTimeout(() => {
            ionApp.style.display = "block";
            scanSub.unsubscribe(); // stop scanning
            context.qrScanner.hide();
          }, 5000);
          // wait for user to scan something, then the observable callback will be called


        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          alert('Permission denied');
        } else {
          alert('Permission denied, try again');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => {
        console.log(e);
        alert('Error is ' + e)
      });*/
  }
}
