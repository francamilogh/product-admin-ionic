import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'communications',
        loadChildren: () => import('./communications/communications.module').then(m => m.CommunicationsPageModule)
      },
      {
        path: 'visits',
        loadChildren: () => import('./visits/visits.module').then(m => m.VisitsPageModule)
      },
      {
        path: 'date-time',
        loadChildren: () => import('./date-time/date-time.module').then(m => m.DateTimePageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
