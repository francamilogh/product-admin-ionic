import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateCommunicationComponent } from '../../../shared/components/add-update-communication/add-update-communication.component';
import { User } from '../../../models/user.model';
import { Communication } from 'src/app/models/communication.model';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.page.html',
  styleUrls: ['./communications.page.scss'],
})
export class CommunicationsPage implements OnInit {


  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  communications: Communication[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  // Función de tipo User de la carpeta models para traer siempre el user del local storage
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // ========== Visualizar pcommunicationos =============
  ionViewWillEnter() {
    this.getCommunications();
  }

  // ========== Actualizar la aplicación ==========
  doRefresh(event) {
    setTimeout(() => {
      this.getCommunications();
      event.target.complete();
    }, 1000);
  }


  // ========== Obtener pcommunicationos =============
  getCommunications() {
    let path = `users/${this.user().uid}/communications`; // trae el uid de la función user()

    this.loading = true;
    // let query = (orderBy('soldUnits','desc'))
    let query = [
      orderBy('creationDate', 'desc'),
      // where('soldUnits',">",5)
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.communications = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }


  // ========== Agregar o actualizar un pcommunicationo =============
  async addUpdateCommunication(communication?: Communication) {

    let success = await this.utilsSvc.presentModal({ // espera a que se cierre la modal
      component: AddUpdateCommunicationComponent, // se coloca como parámetro el componente que creamos para actualizar o crear pcommunicationo
      cssClass: 'add-update-modal',
      componentProps: { communication }
    })

    if (success) this.getCommunications(); // recarga la modal de los procductos
  }

  // ========== Confirmar eliminación de un pcommunicationo ==========

  async confirmDeleteCommunication(communication: Communication) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Pcommunicationo',
      message: '¿Quieres eliminar este pcommunicationo?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteCommunication(communication);
          }
        }
      ]
    })
  }

  // ========== Eliminar un pcommunicationo ==========
  async deleteCommunication(communication: Communication) { // debe ser una función asincrona ya que nos va a traer información 
    // toma el porducto con id para eliminar
    let path = `users/${this.user().uid}/communications/${communication.id}`;

    // Llama al servico loading
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Se toma el pcommunicationo y se elimina del storage 
    this.firebaseSvc.deleteDocument(path).then(async res => {

      // Actualiza la lista de los pcommunicationos sin el pcommunicationo eliminado
      this.communications = this.communications.filter(p => p.id !== communication.id);

      this.utilsSvc.presentToast({
        message: 'Pcommunicationo eliminado satisfactoriamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circule-outline'

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
