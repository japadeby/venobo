import { Injectable, Inject } from '@angular/core';
import { from, zip } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

import { ITorrent, TorrentService } from '../torrent';
import { BaseMetadataProvider } from './providers';
import { USE_METADATA_PROVIDER } from './tokens';
import {
  MovieMetadata,
  ShowMetadata,
  TMDbMovieResponse,
  TMDbShowResponse
} from './interfaces';

// @TODO: Add caching to all methods
@Injectable()
export class MetadataService {

  constructor(
    @Inject(USE_METADATA_PROVIDER)
    private readonly metadataProvider: BaseMetadataProvider,
    private readonly torrentAdapter: TorrentService,
  ) {}

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  private formatMovieMetadata = (
    data: TMDbMovieResponse,
    torrents: ITorrent[] = [],
  ): MovieMetadata => ({
    title: data.title,
    imdb: data.imdb_id,
    originalTitle: data.original_title,
    poster: this.metadataProvider.formatPoster(data.poster_path),
    backdrop: this.metadataProvider.formatBackdrop(data.backdrop_path),
    genres: data.genres.map(genre => genre.name),
    type: 'movie',
    summary: data.overview,
    popularity: data.popularity,
    tmdb: data.id,
    year: this.formatReleaseYear(data.release_date),
    voted: data.vote_average,
    votes: data.vote_count,
    released: data.release_date,
    runtime: data.runtime ? `${data.runtime}min` : 'N/A',
    cached: Date.now(),
    torrents,
  });

  /*private formatShowMetadata = (
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
    // imdb: data.imdb_id,
    year: this.formatReleaseYear(data.first_air_date),
    released: data.first_air_date,
    voted: data.vote_average,
    votes: data.vote_count,
    seasonEpisodes: torrents,
    // episodesCount: 0,
    seasonsCount: data.number_of_seasons
  });*/

  public getMovieById(id: number) {
    return this.metadataProvider.get('movies', id).pipe(
      mergeMap((metadata: TMDbMovieResponse) =>
        this.torrentAdapter.search(metadata.original_title, 'movies', {
          imdbId: metadata.imdb_id,
        }).pipe(
          map(torrents => this.formatMovieMetadata(metadata, torrents)),
        ),
      ),
    );
  }

  public getTopRated(type: string) {
    const method = type === 'shows'
      ? 'checkShow'
      : 'getMovieById';

    return this.metadataProvider.getTopRated(type).pipe(
      mergeMap(({ results }) => zip(
        ...results.map(media => this.getMovieById(media.id))
      )),
    );
  }

}
