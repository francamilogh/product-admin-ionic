import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  // Creamos los campos que se utilizaran en nuestro HTML

  form = new FormGroup({
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
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        this.getUserInfo(res.user.uid); // llamamos la función de getUserInfo
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

  async getUserInfo(uid: string) { // Crea o actualiza información del usuario 
    if (this.form.valid) { // Se valida que el formulario es válido entonces llama al servico loading
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = 'users/${uid}'; // se toma la información del uid del usuario

      // se toma el modelo User y se asigna a una respuesta 
      this.firebaseSvc.getDocument(path).then((user: User) => {


        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset;

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circule-outline'

        })


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