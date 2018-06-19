import PouchDB from 'pouchdb';
import findCursor from 'pouchdb-find';

//import { StateDocument, UsersDocument } from './interfaces';
import { MovieMetadata } from '../api/metadata';
import { ITorrent } from '../api/torrent';

PouchDB.plugin(findCursor);

export function createIndexDatabase<T>(name, fields) {
  const db = new PouchDB<T>(name, { adapter: 'leveldb' });

  db.createIndex({
    index: { fields },
  });

  return db;
}

export const metadata = createIndexDatabase<MovieMetadata[]>('metadata', ['id', 'iso']);

export const movies = createIndexDatabase<{
  id: number,
  torrents: ITorrent[]
}>('movies', ['id']);

//export const state = new PouchDB<StateDocument>('state', { adapter: 'leveldb' });

//export const users = new PouchDB<UsersDocument>('users', { adapter: 'leveldb' });
