import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class MinibusDataService {
    public static BASE_URL = 'https://data.etagmb.gov.hk';

  constructor(
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
}
