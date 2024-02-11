import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateVisitComponent } from 'src/app/shared/components/add-update-visit/add-update-visit.component';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.page.html',
  styleUrls: ['./visits.page.scss'],
})
export class VisitsPage implements OnInit {

  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // ========== Agregar o actualizar una visita =============
  addUpdateVisit() {
    this.utilsSvc.presentModal({
      component: AddUpdateVisitComponent, // se coloca como parámetro el componente que creamos para actualizar o crear visita
      cssClass: 'add-update-modal'
    })

  }
}
