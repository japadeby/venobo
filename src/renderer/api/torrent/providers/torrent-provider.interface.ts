import { AxiosInstance, AxiosResponse } from 'axios';

export type TorrentHealth = 'poor' | 'decent' | 'healthy';

export type TorrentVideoQuality = '4k' | '1080p' | '720p' | '480p' | null;

export type FetchResponse = AxiosResponse<string, any>;

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
}

export interface ITorrentProvider {

    /**
     * Endpoint for torrent domain
     */
    endpoint: string;
    /**
     * Torrent provider
     */
    provider: string;
    /**
     * HTTP module
     */
    api: AxiosInstance;

    //fetch?(query: string): Promise<ITorrent[]>;

    /**
     * Fetch all torrent movies related to query
     * @param {string} query
     * @returns {Promise<ITorrent[]>}
     */
    //fetchMovies?(query: string): Promise<ITorrent[]>;

    /**
     * Fetch all torrent shows related to query
     * @param {string} query
     * @returns {Promise<ITorrent[]>}
     */
    // fetchShows?(query: string): Promise<ITorrent[]>;

    /**
     * Get status of torrent endpoint
     * @returns {Promise<boolean>}
     */
    getStatus(): Promise<boolean>;

    /**
     * Fetch movies / shows depending on IMDb ID
     * @param {string} imdbId
     * @param {string} type
     * @param {ExtendedDetails} extendedDetails
     * @returns {Promise<ITorrent[]>}
     */
    provide(imdbId: string | null, type: string, extendedDetails: ExtendedDetails): Promise<ITorrent[]>;

    /**
     * Transform html into a torrent list
     * @param {string} html
     * @returns {ITorrent[]}
     */
    cheerio?(html: string): ITorrent[];
}
