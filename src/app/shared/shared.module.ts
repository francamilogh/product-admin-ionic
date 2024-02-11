import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';
import { AddUpdateCommunicationComponent } from './components/add-update-communication/add-update-communication.component';
import { AddUpdateVisitComponent } from './components/add-update-visit/add-update-visit.component';


// declaramos los componentes CustomInputComponent, HeaderComponent, LogoComponent
@NgModule({
  declarations: [
    CustomInputComponent, 
    HeaderComponent, 
    LogoComponent,
    AddUpdateProductComponent, // Declaramos el componente
    AddUpdateCommunicationComponent, // Declaramos el componente
    AddUpdateVisitComponent // Declaramos el componente
  ],
  
    // exportamos los componentes CustomInputComponent, HeaderComponent, LogoComponent, ReactiveFormsModule,
  exports: [
    CustomInputComponent, 
    HeaderComponent, 
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateProductComponent, // Exportamos el componente AddUpdateProductComponente
    AddUpdateCommunicationComponent,  // Exportamos el componente
    AddUpdateVisitComponent // Exportamos el componente
  ],
  
  // Importamos el módulo Ionic Modeule IonicModule, ReactiveFormsModule, FormsModule
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
