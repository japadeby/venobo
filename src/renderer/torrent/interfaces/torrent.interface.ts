export type TorrentHealth = 'poor' | 'decent' | 'healthy';

export type TorrentVideoQuality = '4k' | '1080p' | '720p' | '480p' | null;

export interface ExtendedDetails {
  imdbId?: string;
  season?: number | string;
  episode?: number | string;
}

export interface ITorrent {
  size: string;
  magnet: string;
  provider: string;
  metadata: string;
  seeders: number;
  leechers?: number;
  verified?: boolean;
  method?: 'shows' | 'movies';
  health?: TorrentHealth;
  quality?: TorrentVideoQuality;
  cached?: number;
  id?: number;
}
