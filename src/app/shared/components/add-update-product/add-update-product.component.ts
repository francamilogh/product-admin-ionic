import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  // Creamos los campos que se utilizaran en nuestro HTML

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),

  })

  firebaseSvc = inject(FirebaseService); // Creamos la variable firebaseSvc para llamar el servicio de  Firebase
  utilsSvc = inject(UtilsService); // Creamos la variable utilsSvc para llamar el servicio de Utils

  ngOnInit() {
  }

  // ========== Tomar o seleccionar imagen ==========
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl; // Asigna en una variable al información de la imagen a tomar
    this.form.controls.image.setValue(dataUrl); // envía al control del formulario el dato de la imegn o foto capturada
  }


  async submit() { // debe ser una función asincrona ya que nos va a traer información 
    if (this.form.valid) { // Se valida que el formulario es válido entonces llama al servico loading
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // se toma el modelo User y se asigna a una respuesta 
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);
        let uid = res.user.uid; // en variable uid se toma el valor de uid de user
      }).catch(error => { // Si se presenta un error mostrar error en un toast
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circule-outline'

        })

      }).finally(() => {
        loading.dismiss(); // Al finalizar se despeja o cierra el loading
      })
    }
  }
}