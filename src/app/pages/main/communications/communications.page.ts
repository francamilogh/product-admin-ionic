import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from '../../../services/firebase.service';
import { AddUpdateCommunicationComponent } from '../../../shared/components/add-update-communication/add-update-communication.component';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.page.html',
  styleUrls: ['./communications.page.scss'],
})
export class CommunicationsPage implements OnInit {

  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // ========== Agregar o actualizar una comunicación =============
  addUpdateCommunication() {
    this.utilsSvc.presentModal({
      component: AddUpdateCommunicationComponent, // se coloca como parámetro el componente que creamos para actualizar o crear comunicación
      cssClass: 'add-update-modal'
    })

  }


}
