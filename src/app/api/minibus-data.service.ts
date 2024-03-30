import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, lastValueFrom } from 'rxjs';
import * as _ from 'underscore';
import { SavedRouteService } from '../storage/saved-route.service';
import { SavedETA, db as etaDB } from '../storage/saved-eta.db';

@Injectable({
  providedIn: 'root'
})
export class MinibusDataService {
    private _minibusETAUpdated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public minibusETAUpdated = this._minibusETAUpdated.asObservable();

    public static BASE_URL = 'https://data.etagmb.gov.hk';

  constructor(
    private savedRouteService: SavedRouteService,
    private httpClient: HttpClient,
  ) {}

  get BASE_URL() {
    return 'https://data.etagmb.gov.hk';
  }

  get REGION() {
    return [
        'KLN',
        'HKI',
        'NT',
    ];
  }

  async getMiniBusRouteList(region: string) {
    const data: any = await lastValueFrom(this.httpClient.get(`${MinibusDataService.BASE_URL}/route/${region}`));
    if (!data?.data?.routes) return [];
    
    const promises = data.data.routes.map((route: any) => lastValueFrom(this.httpClient.get(`${MinibusDataService.BASE_URL}/route/${region}/${route}`)));

    return _.flatten((await Promise.all(promises)).map((response: any) => response?.data));
  }

  async getMiniBusRouteStop(routeId: number, routeSeq: number) {
    return lastValueFrom(this.httpClient.get(`${MinibusDataService.BASE_URL}/route-stop/${routeId}/${routeSeq}`));
  }

  async getMiniBusRouteETA(routeId: number, stopId: number) {
    return lastValueFrom(this.httpClient.get(`${MinibusDataService.BASE_URL}/eta/route-stop/${routeId}/${stopId}`));
  }

  async watchETAs() {
    const {savedRoutes} = await this.savedRouteService.getAll();
    const promises = savedRoutes.map(async (route: any) => {
        const {route_id, stop_id} = route;
        return {
            route_id,
            stop_id,
            data: await this.getMiniBusRouteETA(route_id, stop_id)
        };
    });
    const results = await Promise.all(promises);

    const dbPromises = results.map(async (result: any) => {
        const {route_id, stop_id, data} = result;
        return etaDB.add({
            route_id,
            stop_id,
            eta: data,
            timestamp: data.generated_timestamp,
        });
    });

    const out = await Promise.all(dbPromises)
    this._minibusETAUpdated.next(out);
    return out;
  }
}
