import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SavedETA, db as etaDB } from '../storage/saved-eta.db';
import { SavedRouteService } from '../storage/saved-route.service';
import { SavedRoute, SavedRouteDetail } from '../storage/saved-route.db';
import * as _ from 'underscore';
import { MinibusDataService } from '../api/minibus-data.service';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.page.html',
  styleUrls: ['./eta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EtaPage implements OnInit, OnDestroy {
    private minibusETASubscription?: Subscription;
    private savedRoutesUpdatedSubscription?: Subscription;

    public savedRoutes: SavedRoute[] = [];
    public savedRouteDetails: SavedRouteDetail[] = [];
    public etaByKey: any = {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private savedRouteService: SavedRouteService,
    private miniBusDataService: MinibusDataService,
  ) { }

  ngOnInit() {
    this.refreshETAs();

    this.savedRoutesUpdatedSubscription = this.savedRouteService.savedRoutesUpdated.subscribe(async (data) => {
        if (data !== undefined && data !== null) {
            console.warn('Saved routes updated');
            this.refreshETAs();
            this.changeDetectorRef.detectChanges();
        }
    });

    this.minibusETASubscription = this.miniBusDataService.minibusETAUpdated.subscribe(async (data) => {
        if (data !== undefined && data !== null) {
            const etas = await etaDB.savedETAs.toArray();
            const etaByKey = _.object(etas.map((eta) => [`${eta.route_id}-${eta.stop_id}`, eta.eta]));
            this.etaByKey = etaByKey;
        }
    });
  }

  ngOnDestroy(): void {
    this.minibusETASubscription?.unsubscribe();
    this.savedRoutesUpdatedSubscription?.unsubscribe();
  }

  async refreshETAs() {
    const {savedRoutes, savedRouteDetails} = await this.savedRouteService.getAll();
    this.savedRoutes = savedRoutes;
    this.savedRouteDetails = savedRouteDetails;
  }

  get savedRouteDetailsBySavedRouteId(): any {
    return _.object(this.savedRouteDetails.map((routeDetail) => [routeDetail.saved_route_id, routeDetail]));
  }

}
