import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationsPageRoutingModule } from './communications-routing.module';

import { CommunicationsPage } from './communications.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationsPageRoutingModule,
    SharedModule // importamos nuestro módulo SharedModule
  ],
  declarations: [CommunicationsPage]
})
export class CommunicationsPageModule {}
