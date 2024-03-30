import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MinibusDataService } from './api/minibus-data.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, HttpClientModule],
  providers: [MinibusDataService],
})
export class AppComponent implements OnInit, OnDestroy {
  private watchMinibusETASubscription?: Subscription;

  constructor(
    private minibusDataService: MinibusDataService,
  ) {}

  ngOnInit() {
    this.minibusDataService.watchETAs();
    this.watchMinibusETASubscription = interval(15000).subscribe(() => {
      this.minibusDataService.watchETAs();
    });
  }

  ngOnDestroy() {
    this.watchMinibusETASubscription?.unsubscribe();
  }
}
