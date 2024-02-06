import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController); // Inyectamos en variable loadingCtrl de tipo LoadingController 
  toastCtrl = inject(ToastController); // Inyectamos en variable toastCtrl de tipo ToastController
  router = inject(Router); // Inyectamos en variable Router que enruta a cualquier parte 


  //================ Loading ==============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' }) // establecemos en la función en tipo de carga

  }

  //================ Toast ==============
  async presentToast(opts?: ToastOptions) { // Esta función sirve para mostrar al generarrse un error de validación de credenciales
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


}
