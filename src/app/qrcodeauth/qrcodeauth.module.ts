import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QrCodeAuth } from './qrcodeauth.page';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: QrCodeAuth
      }
    ])
  ],
  declarations: [QrCodeAuth],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QrCodeAuthPageModule {}
