import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  // Arreglo de páginas
  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
    { title: 'Comunicaciones', url: '/main/communications', icon: 'megaphone-outline' },
    { title: 'Visitas', url: '/main/visits', icon: 'people-outline' },
    { title: 'Fechas', url: '/main/date-time', icon: 'calendar-outline' },
  ]

  router = inject(Router); // inyectamos el router

  // Inyectamos los servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = ''; // indica la URL Actual

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }

  // ========== Cerrar sesión =============
  signOut() {
    this.firebaseSvc.signOut(); // Cierra el getAuth
  }

}
