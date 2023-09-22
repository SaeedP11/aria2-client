/* Import */
// Enum
import { Aria2DownloadStatus, Aria2ExitStatus } from 'src/enums/aria2.enum';

export interface IAria2Download {
  gid: string;
  status: Aria2DownloadStatus;
  totalLength: number;
  completedLength: number;
  uploadLength: number;
  bitfield?: string;
  downloadSpeed: number;
  uploadSpeed: number;
  infoHash?: string; // BitTorrent only
  numSeeders?: string; // BitTorrent only
  seeder?: string; // BitTorrent only
  pieceLength: string;
  numPieces: number;
  connections: number;
  errorCode?: Aria2ExitStatus;
  errorMessage?: string;
  followedBy?: string[];
  following?: string;
  belongsTo?: string;
  dir: string;
  files: IAria2File[];
  bittorrent?: {
    announceList: string[];
    comment?: string;
    creationDate: number;
    mode: 'single' | 'multi';
    info: {
      name: string;
    };
  }; // BitTorrent only
  verifiedLength?: number;
  verifyIntegrityPending?: boolean;
}

export interface IAria2Uri {
  uri: string;
  status: Aria2DownloadStatus;
}

export interface IAria2File {
  index: number;
  path: string;
  length: number;
  completedLength: number;
  selected: boolean;
  uris: IAria2Uri[];
}

export interface IAria2Peer {
  peerId: string;
  ip: string;
  port: number;
  bitfield: string;
  amChoking?: boolean;
  peerChoking?: boolean;
  downloadSpeed: number;
  uploadSpeed: number;
  seeder: boolean;
}

export interface IAria2Server {
  index: number;
  servers: {
    uri: string;
    currentUri: string;
    downloadSpeed: number;
  }[];
}

export interface IAria2GlobalStat {
  downloadSpeed: number;
  uploadSpeed: number;
  numActive: number;
  numWaiting: number;
  numStopped: number;
  numStoppedTotal: number;
}
