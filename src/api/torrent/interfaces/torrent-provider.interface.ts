import { ExtendedDetails, ITorrent } from './torrent.interface';
import { AxiosInstance } from 'axios';

export interface ITorrentProvider {

  /**
   * Endpoint domains for torrent provider
   */
  readonly domains?: string[];

  /**
   * Endpoint for torrent domain
   */
  readonly endpoint?: string;
  /**
   * Torrent provider
   */
  readonly provider: string;
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
  cheerio?(html: string): any[]; // ITorrent[];
}
