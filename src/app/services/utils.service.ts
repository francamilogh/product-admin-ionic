import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController); // Inyectamos en variable loadingCtrl de tipo LoadingController 
  toastCtrl = inject(ToastController); // Inyectamos en variable toastCtrl de tipo ToastController 

  //================ Loading ==============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' }) // establecemos en la función en tipo de carga

  }

  async presentToast(opts?: ToastOptions) { // Esta función sirve para mostrar al generarrse un error de validación de credenciales
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }





}
