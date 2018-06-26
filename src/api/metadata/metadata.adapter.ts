import { ExtendedDetails, ITorrent, TorrentAdapter } from '../torrent';
import { TMDbProvider } from './tmdb.provider';
import { Database } from '../../database';
import { MOVIES } from '../../constants';
import { ConfigState } from '../../renderer/stores/config.store';
import {
  TMDbMovieResponse,
  TMDbShowResponse,
  MovieMetadata,
  ShowMetadata
} from './interfaces';

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

  private async saveMovieMetadata(metadata: TMDbMovieResponse, torrents: ITorrent[]) {

  }

  private async getMovieMetadata(id: number, ietf: string): Promise<MovieMetadata> {
    let metadata;

    try {
      metadata = await Database.findOne<MovieMetadata>('metadata', {
        selector: { id, ietf }
      });
    } catch (e) {
      const data = await this.tmdbProvider.get('movie', id);
      metadata = {
        ...this.formatMovieMetadata(data),
        id,
        ietf,
      };

      await Database.metadata.post(metadata);
    }

    return metadata;
  }

  private async getMovieTorrents(
    id: number,
    title: string,
    extendedDetails: ExtendedDetails
  ): Promise<ITorrent[]> {
    let torrents;

    try {
      torrents = await Database.find<ITorrent[]>('movies', {
        selector: { id }
      });
    } catch (e) {
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
    const metadata = await this.getMovieMetadata(id, this.config.user.prefs.ietf);
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
