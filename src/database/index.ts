import PouchDB from 'pouchdb';
import findCursor from 'pouchdb-find';
import erase from 'pouchdb-erase';

//import { StateDocument, UsersDocument } from './interfaces';
import { MovieMetadata } from '../renderer/api/metadata/index';
import { ITorrent } from '../renderer/api/torrent/index';

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

  export const metadata = createIndexDatabase<MovieMetadata[]>('metadata', ['id', 'iso']);

  export const movies = createIndexDatabase<ITorrent[]>('movies', ['id', 'provider']);

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
