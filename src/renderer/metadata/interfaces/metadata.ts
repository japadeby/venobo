import { ITorrent } from '../../torrent';

export interface Metadata {
  // ietf?: string;
  title: string;
  originalTitle: string;
  poster: string;
  backdrop: string;
  genres: string[];
  type: string;
  summary: string;
  popularity: string;
  tmdb: number;
  year: number | string;
  voted: number;
  votes: number;
}

export interface MovieMetadata extends Metadata {
  imdb: string;
  runtime: string;
  released: string;
  cached: number;
  torrents: ITorrent[];
}

export interface ShowMetadata extends Metadata {
  // episodesCount: number;
  seasonsCount: number;
  seasonEpisodes: ITorrent[];
}

export interface ShowEpisodeMetadata extends Metadata {
  title: string;
  episode: number;
  season: number;
  poster: string;
  summary: string;
  votes: number;
  voted: number;
  airDate: string;
  torrents: ITorrent[];
}

export type MetadataUnion = MovieMetadata & ShowMetadata;
