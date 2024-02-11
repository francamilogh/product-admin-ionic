import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from '../../../shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // ========== Cerrar sesión =============
  signOut() {
    this.firebaseSvc.signOut(); // Cierra el getAuth
  }

  // ========== Agregar o actualizar un producto =============
  addUpdateProduct() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent, // se coloca como parámetro el componente que creamos para actualziar o crear producto
      cssClass: 'add-update-modal'
    })

  }

}
