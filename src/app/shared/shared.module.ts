import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// declaramos los componentes CustomInputComponent, HeaderComponent, LogoComponent
@NgModule({
  declarations: [
    CustomInputComponent, 
    HeaderComponent, 
    LogoComponent],
  
    // exportamos los componentes CustomInputComponent, HeaderComponent, LogoComponent, ReactiveFormsModule,
  exports: [
    CustomInputComponent, 
    HeaderComponent, 
    LogoComponent,
    ReactiveFormsModule
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
