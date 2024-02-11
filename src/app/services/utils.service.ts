import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController); // Inyectamos en variable loadingCtrl de tipo LoadingController 
  toastCtrl = inject(ToastController); // Inyectamos en variable toastCtrl de tipo ToastController
  modalCtrl = inject(ModalController); // Inyectamos el ModalController para poder utilizar componenentes como modales
  router = inject(Router); // Inyectamos en variable Router que enruta a cualquier parte 


  //================ Loading ==============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' }) // establecemos en la función en tipo de carga

  }

  //================ Toast ==============
  async presentToast(opts?: ToastOptions) { // Esta función sirve para mostrar al generarse un error de validación de credenciales
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //================ Router= enruta a cualquier página disponible ==============
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //================ Guarda elemento en el localstorage ==============
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //================ Obtiene elemento desde el localstorage ==============
  getFromLocalStorage(key: string) {
    return JSON.parse (localStorage.getItem(key));
  }

   //================ Modal ==============
   async presentModal(opts: ModalOptions) { // se crea parámetro opts: y se importa el ModalOptions
    const modal = await this.modalCtrl.create(opts); // se toma el parámetro opts
    await modal.present();

    const { data }=await modal.onWillDismiss(); // Valida que si exista la modal y si no se cierra 
    if(data) return data; // valida que existan datos en la modal
   }

   //================ Cierra la Modal ==============
   dismissModal(data?:any){ // el signo ? me dinica que la data puede o no traer valores
    return this.modalCtrl.dismiss(data);
   }


}
