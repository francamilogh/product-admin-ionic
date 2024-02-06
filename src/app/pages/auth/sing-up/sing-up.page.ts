import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {

  // Creamos los campos que se utilizaran en nuestro HTML

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])

  })

  firebaseSvc = inject(FirebaseService); // Creamos la variable firebaseSvc para llamar el servicio de  Firebase
  utilsSvc = inject(UtilsService); // Creamos la variable utilsSvc para llamar el servicio de Utils

  ngOnInit() {
  }

  async submit() { // debe ser una función asincrona ya que nos va a traer información 
    if (this.form.valid) { // Se valida que el formulario es válido entonces llama al servico loading
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // se toma el modelo User y se asigna a una respuesta 
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.name);
        
        let uid = res.user.uid; // en variable uid se toma el valor de uid de user
        this.form.controls.uid.setValue(uid); // seteamos el valor uid del usuario en el uid del formulario
        this.setUserInfo(uid); // llevamos los datos del usuario con el uid

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

  async setUserInfo(uid: string) { // Crea o actualiza información del usuario 
    if (this.form.valid) { // Se valida que el formulario es válido entonces llama al servico loading
      const loading = await this.utilsSvc.loading();
      await loading.present();
      
      let path = 'users/${uid}'; // se toma la información del uid del usuario
      delete this.form.value.password; // se elimina la contraseña del formulario

      // se toma el modelo User y se asigna a una respuesta 
      this.firebaseSvc.setDocument(path, this.form.value).then(res => {
        console.log(res);

       this.utilsSvc.saveInLocalStorage('user', this.form.value) 
        this.utilsSvc.routerLink('/main/home');
        this.form.reset;




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



