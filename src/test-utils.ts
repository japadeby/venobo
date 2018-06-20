import { ITorrent } from './renderer/api/torrent';
import { MovieMetadata } from './renderer/api/metadata/interfaces';

import tmdb from '../tmdb.config.json';

export namespace TestUtils {

  export function validateMovieTorrents(torrents: ITorrent[]) {
    return expect(torrents).toContainEqual(
      expect.objectContaining({
        //id: expect.any(Number),
        size: expect.any(String),
        magnet: expect.any(String),
        provider: expect.any(String),
        seeders: expect.any(Number),
        quality: expect.any(String),
        method: expect.any(String),
        health: expect.any(String),
        metadata: expect.any(String),
      })
    );
  }

  export function validateMovieMetadata(metadata: MovieMetadata) {
    return expect(metadata).toMatchObject({
      //expect.objectContaining({
      //id: expect.any(Number),
      //iso: expect.any(String),
      title: expect.any(String),
      originalTitle: expect.any(String),
      //poster: expect.stringMatching(tmdb.poster),
      //backdrop: expect.stringMatching(tmdb.backdrop),
      genres: expect.arrayContaining([expect.any(String)]),
      //type: expect.stringMatching('movie'),
      summary: expect.any(String),
      popularity: expect.any(Number),
      tmdb: expect.any(Number),
      imdb: expect.any(String),
      year: expect.any(String),
      released: expect.any(String),
      voted: expect.any(Number),
      votes: expect.any(Number),
      runtime: expect.any(String),
      cached: expect.any(Number),
      //torrents: expect.anything(),*/
    //})
  });
  }

}