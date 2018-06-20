import { MovieMetadata } from '../../renderer/api/metadata/index';
import { ITorrent } from '../../renderer/api/torrent/index';

// @TODO: Create document interface for torrent shows
export interface MovieDocument {
  id: number;
  metadata: {
    [iso: string]: MovieMetadata;
  };
  torrents: ITorrent[];
}
