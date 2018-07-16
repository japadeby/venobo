import { ExtendedDetails, ITorrent, TorrentAdapter } from '../torrent';
import { TMDbProvider } from './tmdb.provider';
import { Database } from '../../database';
import { MOVIES, SHOWS } from '../../constants';
import { ConfigState } from '../../../renderer/stores/config.store';
import {
  TMDbMovieResponse,
  TMDbShowResponse,
  MovieMetadata,
  ShowMetadata,
  TMDbResponse,
} from './interfaces';

export type PromiseMetadata = Promise<(ShowMetadata & MovieMetadata)[]>;

export class MetadataAdapter {

  private readonly tmdbProvider = new TMDbProvider(this.config);

  constructor(
    private readonly torrentAdapter: TorrentAdapter,
    private readonly config: ConfigState,
  ) {}

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  private formatMovieMetadata = (
    data: TMDbMovieResponse,
    torrents: ITorrent[] = [],
  ): MovieMetadata => ({
    title: data.title,
    originalTitle: data.original_title,
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
  });

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
  });

  /*private async getShowMetadata(id: number, ietf: string): Promise<ShowMetadata> {
    let metadata;

    try {
      metadata = await Database.findOne<ShowMetadata>('metadata', {
        selector: { id, ietf },
      });
    } catch (e) {
      const data = await this.tmdbProvider.get('show', id);
    }
  }*/

  private async getMovieMetadata(id: number, ietf: string): Promise<MovieMetadata> {
    let metadata;

    try {
      metadata = await Database.findOne<MovieMetadata>('metadata.movies', {
        selector: { id, ietf }
      });
    } catch (e) {
      const data = await this.tmdbProvider.get('movie', id);
      metadata = {
        ...this.formatMovieMetadata(data),
        id,
        ietf,
      };

      await Database.metadata.movies.post(metadata);
    }

    return metadata;
  }

  private async getShowTorrents(
    id: number,
    title: string,
    extendedDetails: ExtendedDetails,
  ): Promise<ITorrent[]> {
    let torrents;

    try {
      torrents = await Database.find<ShowMetadata>('metadata.shows', {
        selector: { id, ...extendedDetails }
      });
    } catch (e) {
      torrents = await this.torrentAdapter.search(title, SHOWS, extendedDetails);

      await Promise.all(torrents.map(torrent => {
        return Database.metadata.shows.post({
          id,
          ...extendedDetails,
          ...torrent,
        });
      }));
    }

    return torrents;
  }

  private async getMovieTorrents(
    id: number,
    title: string,
    { imdbId }: ExtendedDetails,
  ): Promise<ITorrent[]> {
    let torrents;

    try {
      torrents = await Database.find<MovieMetadata>('metadata.movies', {
        selector: { id }
      });
    } catch (e) {
      torrents = await this.torrentAdapter.search(title, MOVIES, { imdbId });

      await Promise.all(torrents.map(torrent => {
        return Database.metadata.movies.post({
          id,
          ...torrent
        });
      }));
    }

    return torrents;
  }

  /*public async getShowById(id: number): Promise<MovieMetadata> {

  }*/

  public async getMovieById(id: number): Promise<MovieMetadata> {
    const metadata = await this.getMovieMetadata(id, this.config.user.prefs.ietf);

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

  private getTorrentsFromResults(data: TMDbResponse): PromiseMetadata {
    return Promise.all(data.results.map(res => {
      const method = res.media_type === 'tv'
        ? 'checkShow'
        : 'getMovieById';

      return this[method](res.id) as ShowMetadata & MovieMetadata;
    }));
  }

  public async getTopRated(type: string): PromiseMetadata {
    const data = await this.tmdbProvider.getTopRated(type);

    return this.getTorrentsFromResults(data);
  }

  public async getPopular(type: string): PromiseMetadata {
    const data = await this.tmdbProvider.getPopular(type);

    return this.getTorrentsFromResults(data);
  }

  public async quickSearch(query: string/*, limit: number = 100*/): PromiseMetadata {
    const data = await this.tmdbProvider.searchAll(query);

    return this.getTorrentsFromResults(data);
  }

}
