import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {title: 'Inicio', url:'home', icon:'home-outline'},
    {title: 'Comunicaciones', url:'communications', icon:'megaphone-outline'},
    {title: 'Visitas', url:'visits', icon:'people-outline'},
    {title: 'Perfil', url:'profile', icon:'person-outline'}
  ]

  ngOnInit() {
  }

}
