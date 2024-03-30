import Dexie, { Table } from 'dexie';

export interface SavedETA {
    route_id: number;
    stop_id: number;
    eta?: any,
    timestamp?: string;
}

export class AppDB extends Dexie {
    savedETAs!: Table<SavedETA, number>;

    constructor() {
        super('mbETA');
        this.version(4).stores({
            savedETAs: 'route_id, stop_id'
        });
    }

    async add(data: SavedETA) {
        let savedETAs = await this.savedETAs.get({
            route_id: data.route_id,
            stop_id: data.stop_id
        });
        if (savedETAs) {
            return await this.savedETAs.update({
                route_id: data.route_id,
                stop_id: data.stop_id
            }, {...data});
        } else {
            return await this.savedETAs.add(data);
        }
    }

    async getAll() {
        return await this.savedETAs.toArray();
    }

    async remove(id: number) {
        return await this.savedETAs.delete(id);
    }
}

export const db = new AppDB();