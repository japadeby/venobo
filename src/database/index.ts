import PouchDB from 'pouchdb';
import findCursor from 'pouchdb-find';
import erase from 'pouchdb-erase';

import { MovieMetadata } from 'src/api/metadata';
import { ITorrent } from 'src/api/torrent';
import { UserDocument } from './interfaces';

//PouchDB.debug.enable('*');
PouchDB.plugin(findCursor);
PouchDB.plugin(erase);

export namespace Database {

  export function createIndexDatabase<T>(name, fields) {
    const database = new PouchDB<T>(name, { adapter: 'leveldb' });

    database.createIndex({
      index: { fields },
    });

    return database;
  }

  export const metadata = createIndexDatabase<MovieMetadata[]>('metadata', ['id', 'ietf']);

  export const movies = createIndexDatabase<ITorrent[]>('movies', ['id', 'provider']);

  export const users = createIndexDatabase<UserDocument[]>('users', ['id']);

  export const findOne = <T>(database: string, opts: object) => Database.find<T>(database, opts)[0];

  export async function find<T>(database: string, opts: object) {
    const res = (await Database[database] as PouchDB.Database<T>).find(opts).docs;

    if (res.length === 0) throw new Error('Empty result');

    return res;
  }

  export async function destroy() {
    await metadata.destroy();
    await movies.destroy();
  }

  export async function truncate() {
    await metadata.erase();
    await movies.erase();
  }

}

//export const state = new PouchDB<StateDocument>('state', { adapter: 'leveldb' });

//export const users = new PouchDB<UsersDocument>('users', { adapter: 'leveldb' });
