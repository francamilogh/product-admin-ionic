import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Communication } from 'src/app/models/communication.model';
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
  // creationDate: string = new Date().toISOString();
  // updateDate: string = new Date().toISOString();
  // status: boolean = true;

  @Input() communication: Communication;
  user = {} as User;

  listEstates = [
    { id: '1', name: 'Serranías' },
    { id: '2', name: 'Prados' },
    { id: '3', name: 'Altos' },
  ];

  listCommunicationType = [
    { id: '58170e09-a747-4d21-8ab8-96d887150f71', description: 'Acta' },
    { id: '6331ccf0-b815-4177-8a7a-46d14aedb806', description: 'Cuenta Cobro' },
    { id: 'cfe986db-8934-4328-a490-6d4a284acd23', description: 'Invitación' },
    { id: '74d1d30e-2ead-4b51-983c-2cd76d88fb52', description: 'Sanción' }
  ];

  // ========== fields of forms ==========
  form = new FormGroup({
    id: new FormControl(''),
    idUser: new FormControl(''),
    idEstate: new FormControl(''),
    idCommunicationType: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    introduction: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    body: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    urlAttachmentDocument: new FormControl('', [Validators.required]),
    creationDate: new FormControl(new Date().toISOString()),
    startDate: new FormControl(new Date().toISOString(), [Validators.required]),
    endDate: new FormControl(new Date().toISOString()),
    updateDate: new FormControl(new Date().toISOString()),
    signature: new FormControl('', [Validators.required]),
    // status: new FormControl(true),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user'); 
    // if (this.communication) this.form.setValue(this.communication);
  }

  submit() {
    if (this.form.valid) {
      if (this.communication) this.updateCommunication();
      else this.createCommunication();
    }
  }

  // ========== CREATE COMMUNICATION ==========
  async createCommunication() {
    let path = `users/${this.user.uid}/communications`;

    // ========== Call loading ==========
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id

    this.firebaseSvc.addDocument(path,this.form.value).then(async res => { // add document form on storage 
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Comunicación creada satisfactoriamente',
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
  
  // ========== UPDATE COMMUNCATION ==========
  async updateCommunication() {
    let path = `users/${this.user.uid}/communications/${this.communication.id}`;

    // ========== Call loading ==========
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => { // Update form on storage 
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Comunicación actualizada satisfactoriamente',
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
        loading.dismiss(); // Al finalizar se despeja o cierra el loading
      })
    }
  
      // ========== Validations of ion-select ========== 
    compareWith(o1, o2) {
      return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    handleChangeEstate(ev) {
      console.log('Current value listEstate:', JSON.stringify(ev.target.value));
      this.form.controls.idEstate.setValue(ev.target.value.id)
      console.log(this.form.controls.idEstate.value)
    }

    handleChangeCommunicationType(ev) {
      console.log('Current value ListDocummentType:', JSON.stringify(ev.target.value));
      this.form.controls.idCommunicationType.setValue(ev.target.value.id)
    }
  
  
  
  }
    













  