import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelativeTime } from 'src/pipes/relative-time';
import { Chat } from './chat';

@NgModule({
  declarations: [
    Chat,
    RelativeTime
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path: '',
          component: Chat
        }
      ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatModule {
}