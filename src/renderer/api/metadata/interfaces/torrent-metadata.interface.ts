import { ITorrent } from '../../torrent/providers';

export interface TorrentMetadata {
  title: string;
  originalTitle: string;
  tmdb: number;
  genres: string[];
  type: 'movie' | 'show';
  summary: string;
  popularity: string;
  voted: number;
  votes: number;
  releaseDate: string;
  year: number | string;
  poster: string;
  backdrop: string;
}

export interface TorrentMovieMetadata extends TorrentMetadata {
  imdb: string;
  runtime: string;
  released: boolean;
  _cacheExpiration: number;
  torrents: ITorrent[];
}

export interface TorrentShowMetadata extends TorrentMetadata {
  //episodesCount: number;
  seasonsCount: number;
  seasonEpisodes: ITorrent[];
}

export interface TorrentShowEpisodeMetadata {
  title: string;
  episode: number;
  poster: string;
  summary: string;
  votes: number;
  voted: number;
  airDate: string;
  torrents: ITorrent[];
}
