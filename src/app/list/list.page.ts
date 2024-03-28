import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MinibusDataService } from '../api/minibus-data.service';
import { lastValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [MinibusDataService],
})
export class ListPage implements OnInit {
    public routes: any[] = [];
    public isLoading = false;
    public routeIsOpen = false;
    public directionIsOpen = false;

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
    public selectedRegion?: string;
    public selectedRoute: any;
    public selectedDirection: any;

  constructor(
    private minibusDataService: MinibusDataService,
  ) {
    addIcons({ add })
  }

  ngOnInit() {}

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
            if (this.routeDetail.length > 0) this.routeIsOpen = true;
        }
    }

    async selectRoute(route: CustomEvent) {
        // console.warn(route.detail.data);
        this.routeIsOpen = false;

        if (route.detail.data.action === 'route') {
            this.selectedRoute = route.detail.data.route;

            if (this.selectedRoute.directions.length > 1) {
                // console.warn(this.selectedRoute);
                this.directionIsOpen = true;
            } else {
                this.selectDirection(this.selectedRoute.directions[0]);
            }
        }
    }

    async selectDirection(direction: any) {
        // console.warn(direction);
        this.directionIsOpen = false;
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

}
