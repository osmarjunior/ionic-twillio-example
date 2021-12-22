import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { VideoPage } from './video.page';
import { HttpClientModule } from '@angular/common/http';
import { VideoChatService } from '../services/videochat.service';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        component: VideoPage
      }
    ])
  ],
  declarations: [VideoPage]
})
export class VideoPageModule {}
