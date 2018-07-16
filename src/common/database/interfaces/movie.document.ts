import { MovieMetadata } from '../../api/metadata';
import { ITorrent } from '../../api/torrent';

// @TODO: Create document interface for torrent shows
export interface MovieDocument {
  id: number;
  metadata: {
    [ietf: string]: MovieMetadata;
  };
  torrents: ITorrent[];
}