import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
// import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() showMenu!: boolean;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  
  utilsSvc = inject(UtilsService);  

  constructor() { }

  ngOnInit() {}

  dismissModal() { // función que nos permite cerrar la modal
    this.utilsSvc.dismissModal()
  }

}
