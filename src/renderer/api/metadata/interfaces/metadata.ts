import { ITorrent } from '../../torrent';

export interface Metadata {
  iso?: string;
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
  //released: boolean;
  cached: number;
  torrents?: ITorrent[];
}

export interface ShowMetadata extends Metadata {
  //episodesCount: number;
  seasonsCount: number;
  seasonEpisodes: ITorrent[];
}

export interface ShowEpisodeMetadata {
  title: string;
  episode: number;
  poster: string;
  summary: string;
  votes: number;
  voted: number;
  airDate: string;
  //torrents: ITorrent[];
}
