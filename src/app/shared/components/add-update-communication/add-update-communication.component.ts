import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
// import {format} from 'date-fns';

@Component({
  selector: 'app-add-update-communication',
  templateUrl: './add-update-communication.component.html',
  styleUrls: ['./add-update-communication.component.scss'],
})
export class AddUpdateCommunicationComponent implements OnInit {
   
  // parametres form
  user: string = UserActivation.name
  creationDate: string = new Date().toISOString();
  updateDate: string = new Date().toISOString();
  status: boolean = true;

  listCommunicationType = [
    {id: '58170e09-a747-4d21-8ab8-96d887150f71', description: 'Acta'},
    {id: '6331ccf0-b815-4177-8a7a-46d14aedb806', description: 'Cuenta Cobro'},
    {id: 'cfe986db-8934-4328-a490-6d4a284acd23', description: 'Invitación'},
    {id: '74d1d30e-2ead-4b51-983c-2cd76d88fb52', description: 'Sanción'}
  ];

  listEstates = [
    {id: 1, name: 'Serranías'},
    {id: 2, name: 'Prados'},
    {id: 3, name: 'Altos'},
  ];

  // Creamos los campos que se utilizaran en nuestro HTML

  form = new FormGroup({
    id: new FormControl(''),
    idUser: new FormControl(''),
    idEstate: new FormControl(''),
    estate: new FormControl(''),
    idCommunicationType: new FormControl(''),
    communicationType: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    introduction: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    body: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    urlAttachmentDocument: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(''),
    signature: new FormControl('', [Validators.required]),
    // status: new FormControl(''),
  })

  firebaseSvc = inject(FirebaseService); // Creamos la variable firebaseSvc para llamar el servicio de  Firebase
  utilsSvc = inject(UtilsService); // Creamos la variable utilsSvc para llamar el servicio de Utils

  constructor() { }

  ngOnInit() { }

  async submit() { // debe ser una función asincrona ya que nos va a traer información 
    if (this.form.valid) { // Se valida que el formulario es válido entonces llama al servico loading
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // se toma el modelo User y se asigna a una respuesta 
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.title); // VALIDAR ESTE CAMPO
        let uid = res.user.uid; // en variable uid se toma el valor de uid de user
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

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev) {
    console.log('Current value:', JSON.stringify(ev.target.value));
  }
}