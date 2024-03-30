import { Injectable } from '@angular/core';
import { SavedRoute, db } from './saved-route.db';
import { liveQuery } from 'dexie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavedRouteService {
    private _savedRoutesUpdated = new BehaviorSubject<any>(null);
    public savedRoutesUpdated = this._savedRoutesUpdated.asObservable();

    constructor() { }

    add(data: SavedRoute, detail: any) {
        const result = db.add(data, detail);
        result.then(() => {
            this._savedRoutesUpdated.next(result);
        });
        return result;
    }

    getAll() {
        return db.getAll();
    }

    remove(id: number) {
        return db.remove(id);
    }
}
