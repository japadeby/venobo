import { TMDbProvider } from './tmdb.provider';
import { metadata, movies} from '../../documents';

import { ITorrent, TorrentAdapter } from '../torrent';
import {
  TMDbMovieResponse,
  TMDbShowResponse,
  MovieMetadata,
  ShowMetadata
} from './interfaces';
import { Utils } from '../../../utils';
import { MovieDocument } from '../../documents/interfaces';
//import {MovieDocument} from '../../documents/interfaces';

export class MetadataAdapter {

  private tmdbProvider = new TMDbProvider();

  private torrentAdapter = new TorrentAdapter();

  constructor(
    //private readonly movies: PouchDB.Database<any>,
    private readonly state: any,
  ) {}

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  private formatMovieMetadata = (
    data: TMDbMovieResponse,
    //torrents: ITorrent[],
  ): MovieMetadata => ({
    title: data.title,
    originalTitle: data.title,
    poster: this.tmdbProvider.formatPoster(data.poster_path),
    backdrop: this.tmdbProvider.formatBackdrop(data.backdrop_path),
    genres: data.genres.map(genre => genre.name),
    type: 'movie',
    summary: data.overview,
    popularity: data.popularity,
    tmdb: data.id,
    imdb: data.imdb_id,
    year: this.formatReleaseYear(data.release_date),
    released: data.release_date, /*data.status === 'Released'
      ? data.release_date
      : false,*/
    voted: data.vote_average,
    votes: data.vote_count,
    runtime: data.runtime ? `${data.runtime}min` : 'N/A',
    cached: Date.now(),
  })

  private formatShowMetadata = (
    data: TMDbShowResponse,
    torrents: ITorrent[],
  ): ShowMetadata => ({
    title: data.name,
    originalTitle: data.original_name,
    poster: this.tmdbProvider.formatPoster(data.poster_path),
    backdrop: this.tmdbProvider.formatBackdrop(data.backdrop_path),
    genres: data.genres.map(genre => genre.name),
    type: 'show',
    summary: data.overview,
    popularity: data.popularity,
    tmdb: data.id,
    //imdb: data.imdb_id,
    year: this.formatReleaseYear(data.first_air_date),
    released: data.first_air_date,
    voted: data.vote_average,
    votes: data.vote_count,
    seasonEpisodes: torrents,
    // episodesCount: 0,
    seasonsCount: data.number_of_seasons
  })

  private async saveMovieMetadata(metadata: TMDbMovieResponse, torrents: ITorrent[]) {

  }

  // @TODO: Clean this psuedo code mess up
  public async getMovieById(id: number): Promise<MovieMetadata> {
    const torrentsCursor = movies.find({
      selector: { id }
    });

    const metadataCursor = metadata.find({
      selector: { id, iso: 'da-DK' }
    });

    return Promise.all([torrentsCursor, metadataCursor])
      .then(docs => Utils.selectFirstDocs(docs))
      .then(async ([movie, _metadata]: [{ id: number, torrents: ITorrent[] }, MovieMetadata]) => {
        if (!_metadata) {
          const data = await this.tmdbProvider.get('movie', id);
          _metadata = this.formatMovieMetadata(data);

          await metadata.put({
            id,
            iso: 'da-DK',
            ..._metadata,
          });
        }

        if (!movie) {
          const torrents = await this.torrentAdapter.search(_metadata.imdb, 'movie', {
            search: _metadata.originalTitle
          });

          movie = {
            id,
            torrents
          };

          await movies.put(movie);
        }

        return {
          ..._metadata,
          torrents: movie.torrents
        } as MovieMetadata;
      });
  }

}
