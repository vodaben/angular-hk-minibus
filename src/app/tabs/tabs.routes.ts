import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'eta',
        loadComponent: () =>
          import('../eta/eta.page').then((m) => m.EtaPage),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('../list/list.page').then((m) => m.ListPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/eta',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/eta',
    pathMatch: 'full',
  },
];
