import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  scanSubscription;
  server_add: any = 'http://192.168.1.75:5000'
  scanned: boolean;

  constructor(private qrScanner: QRScanner, private router: Router, private httpClient: HttpClient, private navCtrl: NavController) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.scan();
  }
  ionViewWillLeave() {
    this.stopScanning();
  }

  private preview(show: boolean) {
    if (show) {
      (window.document.querySelector("ion-app") as HTMLElement).classList.add("cameraView");
      window.document.body.style.backgroundColor = "transparent";
    } else {
      (window.document.querySelector("ion-app") as HTMLElement).classList.remove("cameraView");
      window.document.body.style.backgroundColor = '#FFF';
    }
  }

  scan() {
    this.scanned = false;
    //(window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    //window.document.body.style.backgroundColor = 'transparent';
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.preview(true);
          this.qrScanner.show();
          this.scanSubscription = this.qrScanner.scan().subscribe((text: string) => {

            this.scanned = true;

            this.httpClient.post(this.server_add + '/auth', JSON.stringify({ uuid: text })).subscribe(
              resultado => {
                console.log(resultado);
                this.navCtrl.back();
              },
              erro => {
                console.log(erro);
                this.navCtrl.back();
              }
            );
          });

          setTimeout(() => {
            if(!this.scanned) {
              this.navCtrl.back();
            }
          }, 5000);
          // wait for user to scan something, then the observable callback will be called
        } else {
          console.error('Permission Denied', status);
          this.navCtrl.back();
        }
      })
      .catch((e: any) => {
        console.error('Error', e);
        this.navCtrl.back();
      });
  }

  stopScanning() {
    (this.scanSubscription) ? this.scanSubscription.unsubscribe() : null;
    this.scanSubscription = null;
    this.preview(false);
    this.qrScanner.hide();
    //this.qrScanner.destroy();
  }
}
