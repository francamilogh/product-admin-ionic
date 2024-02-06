import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//============ Firebase ================
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({mode: 'md'}), // {mode: 'md'} mantiene el diseño de maerial design
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig) // Importamos el módulo para inicializar mi configuración de Firebase

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
