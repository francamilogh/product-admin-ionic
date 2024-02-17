import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  // recibe parámetros para los campos de nuestros formularios
  @Input() control!: FormControl; // toma el control del formulario a crear
  @Input() type!: string; // Determina el tipo de Input a utilizar en el control
  @Input() label!: string; // Para indienficar en qué parámetro estamos escribiendo
  @Input() autocomplete!: string; // permitirá que identifiquemos que el control se autocomplete
  @Input() icon!: string; // permite colocarle un icono a nuestro control
  @Input() disabled!: boolean; // permite deshabilitar el control
  
  // se crean variable para ocultar o mostrar la contraseña 
  isPassword!: boolean;
  hide: boolean = true;
  
  constructor() { }

  ngOnInit() {
  
    if (this.type == 'password') this.isPassword =true;

  }
  // se crea función para ocultar o mostrar la contraseña
  showOrHidePassword(){
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }
}
