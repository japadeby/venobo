import PouchDB from 'pouchdb';
import findCursor from 'pouchdb-find';

//import { StateDocument, UsersDocument } from './interfaces';
import { TorrentMovieMetadata } from '../api/metadata';
import { ITorrent } from '../api/torrent';

PouchDB.plugin(findCursor);

export function createIndexDatabase<T>(name, fields) {
  const db = new PouchDB<T>(name, { adapter: 'leveldb' });

  db.createIndex({
    index: { fields },
  });

  return db;
}

export const metadata = createIndexDatabase<TorrentMovieMetadata[]>('metadata', ['tmdb', 'iso']);

export const movies = createIndexDatabase<ITorrent & { tmdb: number }[]>('movies', ['tmdb']);

//export const state = new PouchDB<StateDocument>('state', { adapter: 'leveldb' });

//export const users = new PouchDB<UsersDocument>('users', { adapter: 'leveldb' });