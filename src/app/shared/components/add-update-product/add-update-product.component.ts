import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})

export class AddUpdateProductComponent implements OnInit {
  
  @Input() product: Product; // Se crea variable para recibir los productos
  user = {} as User; // se crea variable de tipo User

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  firebaseSvc = inject(FirebaseService); // Creamos la variable firebaseSvc para llamar el servicio de  Firebase
  utilsSvc = inject(UtilsService); // Creamos la variable utilsSvc para llamar el servicio de Utils

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user'); // AL iniciar el componente traemos el user del local storage
    if (this.product) this.form.setValue(this.product); // hace que los valores del prodcuto se coloquen en el formulario para poder actualizarlos
  }


  // ========== TOMA O SELECCIONA UNA IMAGEN ==========
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl; // Asigna en una variable al información de la imagen a tomar
    this.form.controls.image.setValue(dataUrl); // envía al control del formulario el dato de la imegn o foto capturada
  }

  submit() {
    if (this.form.valid) { // Se revisa que el formulario es válido
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

// ========== CONVIERTE STRING A NÚMERO ==========

setNumberInputs(){
  let {soldUnits, price} = this.form.controls;

  if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
  if(price.value) price.setValue(parseFloat(price.value));
}


  // ========== CREA UN PRODUCTO ==========
  async createProduct() { // debe ser una función asincrona ya que nos va a traer información 
    let path = `users/${this.user.uid}/products`; // ruta donde se guardan los productos, más el uid del usuario

    // ========== Call loading ==========
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // ========== Sube la imagen y obtiene la url = uid / fecha actual ==========
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl); // al control imagen se le lleva la url de la imagen
    
    delete this.form.value.id // se Elimina porque al enviar los datos se crea automáticamente

    this.firebaseSvc.addDocument(path,this.form.value).then(async res => { // Se toma el formulario y se sube al storage 
      this.utilsSvc.dismissModal({ success: true }); // como es una modal la cerramos
      this.utilsSvc.presentToast({
        message: 'Producto creado satisfactoriamente',
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

  // ========== ACTUALIZAR UN PRODUCTO ==========
  async updateProduct() { // debe ser una función asincrona ya que nos va a traer información 
    // ruta donde se guardan los productos, más el uid del usuario
    let path = `users/${this.user.uid}/products/${this.product.id}`;

    // Llama al servico loading
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // ========== Si cambia la imagen, sube la nueva y obtiene la url ==========
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl); // al control imagen se le lleva la url de la imagen
    }

    // se ilimina porque al enviar los datos se crea automáticamente
    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {     // Se toma el formulario y se sube al storage 
      this.utilsSvc.dismissModal({ success: true }); // como es una modal la cerramos
      this.utilsSvc.presentToast({
        message: 'Producto actualizado satisfactoriamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circule-outline'
      })
    }).catch(error => { // Si se presenta un error muestra error en un toast
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