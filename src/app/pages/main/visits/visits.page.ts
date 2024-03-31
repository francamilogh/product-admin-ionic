import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateVisitComponent } from 'src/app/shared/components/add-update-visit/add-update-visit.component';
import { User } from '../../../models/user.model';
import { Visit } from 'src/app/models/visit.model';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.page.html',
  styleUrls: ['./visits.page.scss'],
})
export class VisitsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  visits: Visit[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getVisits();
  }

  // ========== Refresh aplication ==========
  doRefresh(event) {
    setTimeout(() => {
      this.getVisits();
      event.target.complete();
    }, 1000);
  }

  // ========== Get Visits =============
  getVisits() {
    let path = `users/${this.user().uid}/visits`;

    this.loading = true;
    // let query = (orderBy('soldUnits','desc'))
    let query = [
      orderBy('creationDate', 'desc'),
      // where('soldUnits',">",5)
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.visits = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }

  // ========== Add/Update Visit =============
  async addUpdateVisit(visit?: Visit) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateVisitComponent,
      cssClass: 'add-update-modal',
      componentProps: { visit }
    })

    if (success) this.getVisits();
  }

  // ========== Confirm delete visit ==========
  async confirmDeleteVisit(visit: Visit) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar visita',
      message: '¿Quieres eliminar esta visita?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteVisit(visit);
          }
        }
      ]
    })
  }

  // ========== Delete visit ==========
  async deleteVisit(visit: Visit) {
    let path = `users/${this.user().uid}/visits/${visit.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.visits = this.visits.filter(p => p.id !== visit.id);

      this.utilsSvc.presentToast({
        message: 'Visita eliminada satisfactoriamente',
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
