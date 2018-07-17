import { Injectable } from '@angular/core';

import { ITorrent, TorrentService } from '../torrent';
import { TMDbProvider } from './providers';
import {
  MovieMetadata,
  ShowMetadata,
  TMDbMovieResponse,
  TMDbShowResponse
} from './interfaces';

@Injectable()
export class MetadataService {

  constructor(
    private readonly tmdbProvider: TMDbProvider,
    private readonly torrentService: TorrentService,
  ) {}

  private formatReleaseYear(date: string) {
    return date ? date.substring(0, 4) : 'Unknown';
  }

  /*private formatMovieMetadata = (
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
    released: data.release_date,
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
    // imdb: data.imdb_id,
    year: this.formatReleaseYear(data.first_air_date),
    released: data.first_air_date,
    voted: data.vote_average,
    votes: data.vote_count,
    seasonEpisodes: torrents,
    // episodesCount: 0,
    seasonsCount: data.number_of_seasons
  });*/

}
