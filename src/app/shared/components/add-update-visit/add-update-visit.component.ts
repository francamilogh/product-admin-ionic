import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Visit } from 'src/app/models/visit.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { differenceInMinutes } from 'date-fns'; 
// import {format} from 'date-fns'; 

@Component({
  selector: 'app-add-update-visit',
  templateUrl: './add-update-visit.component.html',
  styleUrls: ['./add-update-visit.component.scss'],
})

export class AddUpdateVisitComponent implements OnInit {

  @Input() visit: Visit;
  user = {} as User;

  _userName: string;
  _startDate: string = new Date().toISOString();
  _endDate: string = new Date().toISOString();
  _status: string = "Activa";
  _payment: string = "No";
  _value: number = 0;

  listEstates = [
    { id: '1', name: 'Serranías' },
    { id: '2', name: 'Prados' },
    { id: '3', name: 'Altos' },
  ];

  listSpaces = [
    { id: '1', name: '1001' },
    { id: '2', name: '2001' },
    { id: '3', name: '3001' },
  ];

  listVisitType = [
    { id: '1', description: 'Personal' },
    { id: '2', description: 'Reparaciones o mantenimiento' },
    { id: '3', description: 'Domicilio' }
  ];

  listVehiculeType = [
    { id: '1', description: 'Ninguno' },
    { id: '2', description: 'Automóvil' },
    { id: '3', description: 'Motocicleta' }
  ];

  // ========== fields of forms ==========
  form = new FormGroup({
    id: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    status: new FormControl(''),
    payment: new FormControl(''),
    idUser: new FormControl(''),
    idEstate: new FormControl('', [Validators.required]),
    idSpace: new FormControl('', [Validators.required]),
    idVisitType: new FormControl('', [Validators.required]),
    idVehiculeType: new FormControl('', [Validators.required]),
    visitorDocumentNumber: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    visitorName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    licensePlate: new FormControl('', [Validators.minLength(6)]),
    value: new FormControl(),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.form.controls.idUser.setValue(this.user.uid);
    this._userName = this.user.name;
    this.form.controls.startDate.setValue(this._startDate);
    this.form.controls.endDate.setValue(this._endDate);
    this.form.controls.status.setValue(this._status);
    this.form.controls.payment.setValue(this._payment);
    this.form.controls.value.setValue(this._value);

    if (this.visit) this.form.setValue(this.visit);
  }

  submit() {
    if (this.form.valid) {
      if (this.visit) this.updateVisit();
      else this.createVisit();
    }
  }

  // ========== CREATE VISIT ==========
  async createVisit() {
    let path = `users/${this.user.uid}/visits`;

    // ========== Call loading ==========
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id

    this.firebaseSvc.addDocument(path,this.form.value).then(async res => { // add document on storage 
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Visita creada satisfactoriamente',
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

  // ========== UPDATE VISIT ==========
  async updateVisit() {
    let path = `users/${this.user.uid}/visits/${this.visit.id}`;
    console.log(path);

    // ========== Call loading ==========
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => { // Update form on storage 
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Visita actualizada satisfactoriamente',
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
    this.form.controls.idEstate.setValue(JSON.stringify(ev.target.value.id));
    console.log(this.form.controls.idEstate.value)
  }

  handleChangeSpace(ev) {
    console.log('Current value listSpace:', JSON.stringify(ev.target.value));
    this.form.controls.idSpace.setValue(JSON.stringify(ev.target.value.id));
    console.log(this.form.controls.idSpace.value)
  }

  handleChangeVisitType(ev) {
    console.log('Current value listVisitType:', JSON.stringify(ev.target.value));
    this.form.controls.idVisitType.setValue(JSON.stringify(ev.target.value.id));
  }

  handleChangeVehiculeType(ev) {
    console.log('Current value listVehiculeType:', JSON.stringify(ev.target.value));
    this.form.controls.idVehiculeType.setValue(JSON.stringify(ev.target.value.id));
  }

  calculatesValue() {
    const result = differenceInMinutes(
      new Date(this.form.controls.endDate.value),
      new Date(this.form.controls.startDate.value)
    )
    console.log((result / 60).toFixed(2))
  }
}
