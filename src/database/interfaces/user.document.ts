// @TODO: Declare types for user config etc
import { History } from 'history';

import { MovieMetadata, ShowMetadata } from '../../api/metadata';
import { TorrentVideoQuality } from '../../api/torrent';
//import { ITorrent } from 'src/api/torrent/interfaces';

export interface UserDocument {
  id: string;
  prefs: {
    language: string;
    ietf: string;
    defaultQuality: TorrentVideoQuality;
  };
  history: History;
  starred: {
    movies: MovieMetadata[];
    shows: ShowMetadata[];
  };
  watched: {
    movies: MovieMetadata[];
    shows: ShowMetadata[];
  };
}
