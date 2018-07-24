import { ITorrent } from '../../torrent/index';

export interface Metadata {
  ietf?: string;
  title: string;
  originalTitle: string;
  tmdb: number;
  genres: string[];
  type: 'movie' | 'show';
  summary: string;
  popularity: string;
  voted: number;
  votes: number;
  released: string | false;
  year: number | string;
  poster: string;
  backdrop: string;
}

export interface MovieMetadata extends Metadata {
  imdb: string;
  runtime: string;
  // released: boolean;
  cached: number;
  torrents?: ITorrent[];
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
