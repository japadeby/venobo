import * as PouchDB from 'pouchdb';
import * as findCursor from 'pouchdb-find';
import * as path from 'path';
import { get, has } from 'lodash';

import { UnknownDatabaseException } from '../exceptions';
import { MovieMetadata, ShowEpisodeMetadata } from '../api/metadata';
import { ConfigStore } from '../../renderer/stores/config.store';
import { UserDocument } from './interfaces';
// import { ITorrent } from '../api/torrent';

// PouchDB.debug.enable('*');
PouchDB.plugin(findCursor);
// PouchDB.plugin(erase);

export namespace Database {

  export function createIndexDatabase<T>(name, fields) {
    const database = new PouchDB<T>(
      path.join(ConfigStore.getConfigPath(), name),
    );

    database.createIndex({
      index: { fields },
    });

    return database;
  }

  export namespace metadata {
    export const movies = createIndexDatabase<MovieMetadata>('metadata.movies', ['id', 'ietf']);

    export const shows = createIndexDatabase<ShowEpisodeMetadata>('metadata.shows', ['id', 'episode', 'season', 'ietf']);
  }

  export const users = createIndexDatabase<UserDocument>('users', ['id']);

  export const findOne = <T>(database: string, opts) => Database.find<T>(database, opts).then(res => res[0]);

  export async function find<T>(database: string, opts): Promise<T[]> {
    if (!has(Database, database)) throw new UnknownDatabaseException(database);

    const res = (await (get(Database, database) as PouchDB.Database<T>).find(opts)).docs;

    if (res.length === 0) throw new Error('Empty result');

    return res;
  }

  /*export async function destroy() {
    await metadata.destroy();
    await movies.destroy();
  }*/

  /*export async function truncate() {
    await metadata.erase();
    await movies.erase();
  }*/

}
