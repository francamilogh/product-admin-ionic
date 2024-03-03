import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateCommunicationComponent } from '../../../shared/components/add-update-communication/add-update-communication.component';
import { User } from '../../../models/user.model';
import { Communication } from 'src/app/models/communication.model';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.page.html',
  styleUrls: ['./communications.page.scss'],
})
export class CommunicationsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  communications: Communication[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getCommunications();
  }

  // ========== Get Communications =============
  getCommunications() {
    let path = `users/${this.user().uid}/communications`;
    
    this.loading = true;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.communications = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }

    // ========== Add/Update Communication =============
    async addUpdateCommunication(communication?: Communication) {

      let success = await this.utilsSvc.presentModal({
        component: AddUpdateCommunicationComponent,
        cssClass: 'add-update-modal',
        componentProps: { communication }
      })
  
      if (success) this.getCommunications();
    }

    // ========== Confirm delete communication ==========
  async confirmDeleteCommunication(communication: Communication) {
    this.utilsSvc.presentAlert({
       header: 'Eliminar comunicación',
       message: '¿Quieres eliminar este comunicación?',
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

   // ========== Delete communication ==========
  async deleteCommunication(communication: Communication) {
    let path = `users/${this.user().uid}/communications/${communication.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.communications = this.communications.filter(p => p.id !== communication.id);

      this.utilsSvc.presentToast({
        message: 'Comunicación eliminada satisfactoriamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circule-outline'

      })
    }).catch(error => { 
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circule-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }

}
