import { MovieMetadata } from 'src/api/metadata';
import { ITorrent } from 'src/api/torrent';

// @TODO: Create document interface for torrent shows
export interface MovieDocument {
  id: number;
  metadata: {
    [ietf: string]: MovieMetadata;
  };
  torrents: ITorrent[];
}
