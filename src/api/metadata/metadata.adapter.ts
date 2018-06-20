import {ExtendedDetails, ITorrent, TorrentAdapter} from '../torrent/index';
import { TMDbProvider } from './tmdb.provider';
import { Database } from '../../database/index';
import { MOVIES } from '../../constants';
import {
  TMDbMovieResponse,
  TMDbShowResponse,
  MovieMetadata,
  ShowMetadata
} from './interfaces/index';
import metadata = Database.metadata;
//import { Utils } from '../../../utils';
//import { MovieDocument } from '../../database/interfaces';
//import { MovieDocument } from '../../database/interfaces';
//import {MovieDocument} from '../../database/interfaces';

export class MetadataAdapter {

  private tmdbProvider = new TMDbProvider();

  //private torrentAdapter = new TorrentAdapter();

  constructor(
    private readonly torrentAdapter: TorrentAdapter,
    //private readonly movies: PouchDB.Database<any>,
    //private readonly state: any,
  ) {}

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  private formatMovieMetadata = (
    data: TMDbMovieResponse,
    torrents: ITorrent[] = [],
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
    torrents,
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

  private async getMovieMetadata(id: number, iso: string): Promise<MovieMetadata> {
    const metadata = await Database.metadata.find<MovieMetadata>({
      selector: { id, iso }
    }).docs || [];

    if (metadata.length === 0) {
      const data = await this.tmdbProvider.get('movie', id);
      metadata.push(this.formatMovieMetadata(data));

      await Database.metadata.post({
        id,
        iso,
        ...metadata[0],
      });
    }

    return metadata[0];
  }

  private async getMovieTorrents(
    id: number,
    title: string,
    extendedDetails: ExtendedDetails
  ): Promise<ITorrent[]> {
    let torrents = await Database.movies.find<ITorrent[]>({
      selector: { id }
    }).docs || [];

    if (torrents.length === 0) {
      torrents = await this.torrentAdapter.search(title, MOVIES, extendedDetails);

      await Promise.all(torrents.map(torrent => {
        return Database.movies.post({
          id,
          ...torrent
        });
      }));
    }

    return torrents;
  }

  // @TODO: Clean this psuedo code mess up
  public async getMovieById(id: number): Promise<MovieMetadata> {
    const iso = 'da-DK';

    const metadata = await this.getMovieMetadata(id, iso);
    //const imdbId = searchByImdbId ? metadata.imdb : null;
    const torrents = await this.getMovieTorrents(
      metadata.tmdb, // same as id
      metadata.originalTitle,
      { imdbId: metadata.imdb }
    );

    return {
      ...metadata,
      torrents
    } as MovieMetadata;
  }

}
