import Dexie, { Table } from 'dexie';

export interface SavedRoute {
    id?: number;
    route_id: number;
    route_name: string;
    route_seq: number;
    stop_id: number;
    stop_seq: number;
}

export interface SavedRouteDetail {
    id?: number;
    saved_route_id: number;
    route: any;
    direction: any;
    stop: any;
}

export class AppDB extends Dexie {
    savedRoutes!: Table<SavedRoute, number>;
    savedRouteDetails!: Table<SavedRouteDetail, number>;

    constructor() {
        super('mbSavedRoute');
        this.version(3).stores({
            savedRoutes: '++id, route_id, route_name, route_seq, stop_id, stop_seq',
            savedRouteDetails: '++id, saved_route_id',
        });
    }

    async add(data: SavedRoute, detail: SavedRouteDetail) {
        let savedRoutes = await this.savedRoutes.get(data);
        if (savedRoutes) throw new Error('Route already saved');

        let savedRouteId = await this.savedRoutes.add(data);
        detail.saved_route_id = savedRouteId;
        return await this.savedRouteDetails.add(detail);
    }

    async getAll() {
        return {
            savedRoutes: await this.savedRoutes.toArray(),
            savedRouteDetails: await this.savedRouteDetails.toArray(),
        };
    }

    async remove(id: number) {
        await this.savedRouteDetails.where('saved_route_id').equals(id).delete();
        return await this.savedRoutes.delete(id);
    }
}

export const db = new AppDB();