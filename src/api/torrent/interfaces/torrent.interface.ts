export type TorrentHealth = 'poor' | 'decent' | 'healthy';

export type TorrentVideoQuality = '4k' | '1080p' | '720p' | '480p' | null;

export type ExtendedDetails = {
    imdbId?: string;
    season?: string;
    episode?: string;
};

export interface ITorrent {
    size: string;
    magnet: string;
    provider: string;
    seeders: number;
    leechers?: number;
    verified?: boolean;
    metadata?: string;
    method?: 'shows' | 'movies';
    health?: TorrentHealth;
    quality?: TorrentVideoQuality;
    cached?: number;
    id?: number;
}
