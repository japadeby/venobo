import { TMDbProvider } from './tmdb.provider';
import { metadata, movies} from '../../documents';

import { ITorrent, TorrentAdapter } from '../torrent';
import {
  TMDbMovieResponse,
  TMDbShowResponse,
  TorrentMovieMetadata,
  TorrentShowMetadata
} from './interfaces';
//import {MovieDocument} from '../../documents/interfaces';

export class MetadataAdapter {

  private tmdb = new TMDbProvider();

  private torrentAdapter = new TorrentAdapter();

  constructor(
    //private readonly movies: PouchDB.Database<any>,
    private readonly state: any,
  ) {}

    /*private iso = 'da-DK';

    public getMovieById(tmdbId: number) {
        return new Promise((resolve, reject) => {
            movies.get(this.iso).get(tmdbId).once((movie: TorrentMovieMetadata) => {
                if (movie && movie._cacheExpiration) return resolve(movie);
            });
        });
    }*/

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  private formatMovieMetadata = (
    data: TMDbMovieResponse,
    //torrents: ITorrent[],
  ): TorrentMovieMetadata => ({
    title: data.title,
    originalTitle: data.title,
    poster: this.tmdb.formatPoster(data.poster_path),
    backdrop: this.tmdb.formatBackdrop(data.backdrop_path),
    genres: data.genres.map(genre => genre.name),
    type: 'movie',
    summary: data.overview,
    popularity: data.popularity,
    tmdb: data.id,
    imdb: data.imdb_id,
    year: this.formatReleaseYear(data.release_date),
    releaseDate: data.release_date,
    voted: data.vote_average,
    votes: data.vote_count,
    runtime: data.runtime ? `${data.runtime}min` : 'N/A',
    released: data.status === 'Released',
    _cacheExpiration: Date.now(),
  })

  private formatShowMetadata = (
    data: TMDbShowResponse,
    torrents: ITorrent[],
  ): TorrentShowMetadata => ({
    title: data.name,
    originalTitle: data.original_name,
    poster: this.tmdb.formatPoster(data.poster_path),
    backdrop: this.tmdb.formatBackdrop(data.backdrop_path),
    genres: data.genres.map(genre => genre.name),
    type: 'show',
    summary: data.overview,
    popularity: data.popularity,
    tmdb: data.id,
    //imdb: data.imdb_id,
    year: this.formatReleaseYear(data.first_air_date),
    releaseDate: data.first_air_date,
    voted: data.vote_average,
    votes: data.vote_count,
    seasonEpisodes: torrents,
    // episodesCount: 0,
    seasonsCount: data.number_of_seasons
  })

  private async saveMovieMetadata(metadata: TMDbMovieResponse, torrents: ITorrent[]) {

  };

  private async addMovieTorrents(data: TMDbMovieResponse) {
    const torrents = await this.torrentAdapter.search(data.imdb_id, 'movies', {
      search: data.original_title,
    });

    if (!torrents || torrents.length === 0) {
      throw new Error('No torrents found!');
    }

    const metadata = this.formatMovieMetadata(data);

    /*const document = {
      id: metadata.tmdb,
      metadata,
      torrents,
    } as MovieDocument;*/
  }

  private async getMovieMetadata(tmdb: number) {
    const iso = 'da-DK';

    try {
      const docs = await metadata.find({
        selector: { tmdb, iso }
      });

      return docs[0];
    }
  }

  public async getMovieById(tmdbId: number) {
    try {
      const docs = await movies.get(String(tmdbId));

      return docs[0];
    } catch (e) {
      const movie = await this.tmdb.get('movie', tmdbId);
    }
  }

}
