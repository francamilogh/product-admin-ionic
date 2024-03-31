import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from '../../../shared/components/add-update-product/add-update-product.component';
import { User } from '../../../models/user.model';
import { Product } from 'src/app/models/product.model';
import { orderBy, where } from 'firebase/firestore';

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



  componentes: Componente[] = [
    {
      icon: 'megaphone-outline',
      name: 'Comunicaciones',
      redirectTo: '../communications',
    },
    {
      icon: 'people-outline',
      name: 'Visitas',
      redirectTo: '../visits',
    },
    {
      icon: 'calendar-outline',
      name: 'DateTime',
      redirectTo: '../date-time',
    }
  ];


  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  // Función de tipo User de la carpeta models para traer siempre el user del local storage
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // ========== Visualizar productos =============
  ionViewWillEnter() {
    this.getProducts();
  }

  // ========== Actualizar la aplicación ==========
  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // ========== Obtener ganancias =============
  getProfits() {
    return this.products.reduce((index, product) => index + product.price * product.soldUnits, 0) // suma precio por cantidad vendidas
  }

  // ========== Obtener productos =============
  getProducts() {
    let path = `users/${this.user().uid}/products`; // trae el uid de la función user()

    this.loading = true;
    // let query = (orderBy('soldUnits','desc'))
    let query = [
      orderBy('soldUnits', 'desc'),
      // where('soldUnits',">",5)
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }


  // ========== Agregar o actualizar un producto =============
  async addUpdateProduct(product?: Product) {

    let success = await this.utilsSvc.presentModal({ // espera a que se cierre la modal
      component: AddUpdateProductComponent, // se coloca como parámetro el componente que creamos para actualizar o crear producto
      cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if (success) this.getProducts(); // recarga la modal de los procductos
  }

  // ========== Confirmar eliminación de un producto ==========

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    })
  }

  // ========== Eliminar un producto ==========
  async deleteProduct(product: Product) { // debe ser una función asincrona ya que nos va a traer información 
    // toma el porducto con id para eliminar
    let path = `users/${this.user().uid}/products/${product.id}`;

    // Llama al servico loading
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Se toma la imagen y se elimina del storage 
    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);
    // Se toma el producto y se elimina del storage 
    this.firebaseSvc.deleteDocument(path).then(async res => {

      // Actualiza la lista de los productos sin el producto eliminado
      this.products = this.products.filter(p => p.id !== product.id);

      this.utilsSvc.presentToast({
        message: 'Producto eliminado satisfactoriamente',
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

  // ========== Cerrar sesión temporal =============
  // signOut() {
  //   this.firebaseSvc.signOut(); // Cierra el getAuth
  // }

}
