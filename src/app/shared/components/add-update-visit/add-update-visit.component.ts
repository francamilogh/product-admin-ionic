import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Visit } from 'src/app/models/visit.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-visit',
  templateUrl: './add-update-visit.component.html',
  styleUrls: ['./add-update-visit.component.scss'],
})

export class AddUpdateVisitComponent  implements OnInit {

  @Input() visit: Visit;
  user = {} as User;

  // id: string,
  // status: string,
  // payment: string,
  // startDate: String,
  // endDate: String,
  // idUser: string,
  // idEstate: string,
  // idSpace: string,
  // idVisitType: string,
  // licensePlate: string,
  // visitorName: string,
  // visitorDocumentNumber: string,
  // description: string,
  // value: number,



  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

}
