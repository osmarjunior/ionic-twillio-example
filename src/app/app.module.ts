import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Chat } from './chat/chat';
import { ChatModule } from './chat/chat.module';
import { VideoChatService } from './services/videochat.service';
import { HttpClientModule } from '@angular/common/http';
import { DeviceService } from './services/device.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [Chat],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ChatModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    VideoChatService,
    DeviceService,
    Diagnostic,
    QRScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
