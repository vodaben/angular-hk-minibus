import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MinibusDataService } from '../api/minibus-data.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SavedRouteService } from '../storage/saved-route.service';
import { SavedRoute } from '../storage/saved-route.db';
import * as _ from 'underscore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [SavedRouteService],
})
export class ListPage implements OnInit, OnDestroy {
    private savedRouteUpdatedSubscription?: Subscription;

    public routes: any[] = [];
    public isLoading = false;
    public routeIsOpen = false;
    public directionIsOpen = false;
    public routeStopIsOpen = false;

    public regionActionSheetButtons = [
        {
          text: 'New Territories',
          data: {
            action: 'NT',
          },
        },
        {
          text: 'Kowloon',
          data: {
            action: 'KLN',
          },
        },
        {
          text: 'Hong Kong Island',
          data: {
            action: 'HKI',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ];
    
    public routeDetail: any;
    public routeStops: any;
    public selectedRegion?: string;
    public selectedRoute: any;
    public selectedDirection: any;

    public savedRoutes: SavedRoute[] = [];
    public savedRouteDetails: any[] = [];

  constructor(
    private minibusDataService: MinibusDataService,
    private savedRouteService: SavedRouteService,
  ) {
    addIcons({ add })
  }

  ngOnInit() {
    this.savedRouteUpdatedSubscription = this.savedRouteService.savedRoutesUpdated.subscribe(async (data) => {
        if (data !== undefined && data !== null) {
            await this.init();
        }
    });

    this.init();
  }

  ngOnDestroy(): void {
      this.savedRouteUpdatedSubscription?.unsubscribe();
  }

  async init() {
    this.isLoading = true;
    try {
        const data = await this.savedRouteService.getAll();
        this.savedRoutes = data.savedRoutes;
        this.savedRouteDetails = data.savedRouteDetails;
        // console.warn(this.savedRouteDetailsBySavedRouteId);
    } catch (error) {
        console.error(error);
    } finally {
        this.isLoading = false;
    }
  }

    async selectRegion(region: CustomEvent) {
        this.isLoading = true;
        try {
            if (this.minibusDataService.REGION.includes(region?.detail?.data?.action)) {
                this.routeDetail = await this.minibusDataService.getMiniBusRouteList(region.detail.data.action);
                // console.warn(this.routeDetail);
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
            if (this.routeDetail?.length > 0) this.routeIsOpen = true;
        }
    }

    async selectRoute(route: CustomEvent) {
        // console.warn(route.detail.data);
        this.routeIsOpen = false;

        if (route.detail.action === 'cancel') return;
        if (route.detail.data.action === 'route') {
            this.selectedRoute = route.detail.data.route;

            if (this.selectedRoute.directions.length > 1) {
                // console.warn('route', this.selectedRoute);
                this.directionIsOpen = true;
            } else {
                this.selectDirection({
                    detail: {
                        data: {
                            direction: this.selectedRoute.directions[0],
                        },
                    },
                });
            }
        }
    }

    async selectDirection(direction: any) {
        this.directionIsOpen = false;
        if (direction?.detail?.action === 'cancel') return;
        if (!direction?.detail?.data?.direction) return;
        // console.warn('dir', direction?.detail?.data?.direction);
        this.isLoading = true;
        this.selectedDirection = direction?.detail?.data?.direction;

        try {
            const data: any = await this.minibusDataService.getMiniBusRouteStop(this.selectedRoute?.route_id, this.selectedDirection?.route_seq);
            // console.warn(data);
            if (data?.data?.route_stops) {
                this.routeStops = data.data.route_stops;
                this.routeStopIsOpen = true;
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    async selectRouteStop(stop: CustomEvent) {
        this.routeStopIsOpen = false;
        if (stop?.detail?.action === 'cancel') return;
        if (!stop?.detail?.data) return;
        // console.warn('stop', stop?.detail?.data);
        this.isLoading = true;
        try {
            await this.savedRouteService.add({
                route_id: this.selectedRoute.route_id,
                route_name: this.selectedRoute.route_code,
                route_seq: this.selectedDirection.route_seq,
                stop_id: stop.detail.data.stop.stop_id,
                stop_seq: stop.detail.data.stop.stop_seq,
            }, {
                route: this.selectedRoute,
                direction: this.selectedDirection,
                stop: stop.detail.data.stop,
            });
            await this.init();
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    get regionRouteActionSheetButtons() {
        const routeButtons = this.routeDetail?.map((route: any) => ({
            text: `${route.route_code} (${route.description_tc}): ${route.directions[0].orig_tc} - ${route.directions[0].dest_tc}`,
            data: {
                action: 'route',
                route: route
            },
        }));
        routeButtons?.push({
            text: 'Cancel',
            role: 'cancel',
            data: {
                action: 'cancel',
            },
        });
        return routeButtons ?? [];
    }

    get routeDirectionActionSheetButtons() {
        const directionButtons = this.selectedRoute?.directions.map((direction: any) => ({
            text: `${direction.orig_tc} - ${direction.dest_tc}`,
            data: {
                action: 'direction',
                direction: direction,
            },
        }));
        directionButtons?.push({
            text: 'Cancel',
            role: 'cancel',
            data: {
                action: 'cancel',
            },
        });
        return directionButtons ?? [];
    }

    get routeStopActionSheetButtons() {
        const routeStopButtons = this.routeStops?.map((stop: any) => ({
            text: stop.name_tc,
            data: {
                action: 'route-stop',
                stop: stop,
            },
        })) ?? [];
        routeStopButtons.push({
            text: 'Cancel',
            role: 'cancel',
            data: {
                action: 'cancel',
            },
        });
        return routeStopButtons;
    }

    get savedRouteDetailsBySavedRouteId() {
        return _.object(
            this.savedRouteDetails.map(
                (routeDetail: any) => [
                    routeDetail.saved_route_id,
                    routeDetail
                ]
            )
        );
    }

}
