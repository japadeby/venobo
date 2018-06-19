export type TorrentHealth = 'poor' | 'decent' | 'healthy';

export type TorrentVideoQuality = '4k' | '1080p' | '720p' | '480p' | null;

export type ExtendedDetails = {
    search?: string;
    season?: string;
    episode?: string;
};

export interface ITorrent {
    size: string;
    magnet: string;
    _provider: string;
    seeders: number;
    leechers?: number;
    verified?: boolean;
    metadata?: string;
    method?: 'shows' | 'movies';
    health?: TorrentHealth;
    quality?: TorrentVideoQuality;
    cached?: number;
}
