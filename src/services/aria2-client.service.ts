/* Import */
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as Aria2 from 'aria2';
// Interface
import { IAria2ClientOptions } from '../interfaces/aria2-client-config.interface';
import {
  IAria2Download,
  IAria2GlobalStat,
} from 'src/interfaces/aria2.interface';
// Enum
import { Aria2ClientFileType } from '../enums/aria2-client-file-type.enum';

const defaultOptions = {
  libs: {
    os,
    fs,
    path,
  },
  config: {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc',
  },
};

export default class Aria2Client {
  // Libs
  private readonly libs: IAria2ClientOptions['libs'];
  //
  readonly defaultDownloadsDir: string;
  readonly defaultCategoryDir: Record<Aria2ClientFileType, string> = {
    [Aria2ClientFileType.GENERAL]: '',
    [Aria2ClientFileType.COMPRESSED]: 'compressed',
    [Aria2ClientFileType.PROGRAM]: 'program',
    [Aria2ClientFileType.VIDEO]: 'video',
    [Aria2ClientFileType.AUDIO]: 'audio',
    [Aria2ClientFileType.PICTURE]: 'picture',
  };
  readonly fileTypes: Record<Aria2ClientFileType, string[]> = {
    [Aria2ClientFileType.GENERAL]: [],
    [Aria2ClientFileType.COMPRESSED]: [],
    [Aria2ClientFileType.PROGRAM]: [],
    [Aria2ClientFileType.VIDEO]: [],
    [Aria2ClientFileType.AUDIO]: [],
    [Aria2ClientFileType.PICTURE]: [],
  };
  //
  private readonly aria2: typeof Aria2;

  constructor({
    defaultDir,
    libs = defaultOptions.libs,
    config = defaultOptions.config,
  }: IAria2ClientOptions = defaultOptions) {
    // Set Libs
    this.libs = libs ?? defaultOptions.libs;
    //
    this.defaultDownloadsDir =
      defaultDir ?? `${this.libs.os.homedir()}/Downloads`;
    //
    if (!this.libs.fs.existsSync(this.defaultDownloadsDir))
      throw new Error('defaultDir is not exist');

    this.aria2 = new Aria2(config);
  }

  async open(): Promise<Event> {
    return await this.aria2.open();
  }

  async close(): Promise<Event> {
    return await this.aria2.close();
  }
  // Aria2 Methods
  async download(uris: string[]): Promise<Record<string, string>> {
    const gids = {};
    for (let i = 0; i < uris.length; i++) {
      const uri = uris[i];
      const { name, type } = this.getFileInfo(uri);
      const dir = this.libs.path.join(
        this.defaultDownloadsDir,
        this.defaultCategoryDir[type],
      );
      gids[uri] = await this.aria2.call('addUri', [uri], { dir });
    }

    return gids;
  }

  async addTorrent(torrent: string): Promise<string> {
    return await this.aria2.call('addTorrent', torrent);
  }

  async addMetalink(metalink: string): Promise<string> {
    return await this.aria2.call('addMetalink', metalink);
  }

  async remove(gid: string): Promise<string> {
    return await this.aria2.call('remove', gid);
  }

  async forceRemove(gid: string): Promise<string> {
    return await this.aria2.call('forceRemove', gid);
  }

  async pause(gid: string): Promise<string> {
    return await this.aria2.call('pause', gid);
  }

  async pauseAll(): Promise<'OK'> {
    return await this.aria2.call('pauseAll');
  }

  async forcePause(gid: string): Promise<string> {
    return await this.aria2.call('forcePause', gid);
  }

  async forcePauseAll(): Promise<'OK'> {
    return await this.aria2.call('forcePauseAll');
  }

  async unpause(gid: string): Promise<string> {
    return await this.aria2.call('unpause', gid);
  }

  async unpauseAll(): Promise<'OK'> {
    return await this.aria2.call('unpauseAll');
  }

  async getStatus(
    gid: string,
    keys: string[] = undefined,
  ): Promise<IAria2Download> {
    return await this.aria2.call('tellStatus', gid, keys);
  }

  async getUris(gid: string): Promise<IAria2Download> {
    return await this.aria2.call('tellStatus', gid);
  }

  async getFiles(gid: string): Promise<IAria2Download> {
    return await this.aria2.call('getFiles', gid);
  }

  async getActiveDownloads(): Promise<IAria2Download[]> {
    return await this.aria2.call('tellActive');
  }

  async getWaitingDownloads(
    offset: number,
    num: number,
  ): Promise<IAria2Download[]> {
    return await this.aria2.call('tellWaiting', offset, num);
  }

  async getStoppedDownloads(
    offset: number,
    num: number,
  ): Promise<IAria2Download[]> {
    return await this.aria2.call('tellStopped', offset, num);
  }

  async changePosition(
    gid: string,
    pos: number,
    how: 'POS_CUR' | 'POS_SET',
  ): Promise<number> {
    return await this.aria2.call('changePosition', gid, pos, how);
  }

  async changeUri(
    gid: string,
    fileIndex: number,
    delUris: string[],
    addUris: string[],
  ): Promise<[number, number]> {
    return await this.aria2.call('changeUri', gid, fileIndex, delUris, addUris);
  }

  async getOption(gid: string): Promise<Record<string, unknown>> {
    return await this.aria2.call('getOption', gid);
  }

  async changeOption(
    gid: string,
    options: Record<string, unknown>,
  ): Promise<'OK'> {
    return await this.aria2.call('changeOption', gid, options);
  }

  async getGlobalOption(): Promise<Record<string, unknown>> {
    return await this.aria2.call('getGlobalOption');
  }

  async changeGlobalOption(options: Record<string, unknown>): Promise<'OK'> {
    return await this.aria2.call('changeGlobalOption', options);
  }

  async getGlobalStat(): Promise<IAria2GlobalStat> {
    return await this.aria2.call('getGlobalStat');
  }

  async purgeDownloadResult(): Promise<'OK'> {
    return await this.aria2.call('purgeDownloadResult');
  }

  async removeDownloadResult(gid: string): Promise<'OK'> {
    return await this.aria2.call('removeDownloadResult', gid);
  }

  async getVersion(): Promise<{ version: string; enabledFeatures: string[] }> {
    return this.aria2.call('getVersion');
  }

  async getSessionInfo(): Promise<{
    sessionId: string;
  }> {
    return this.aria2.call('getSessionInfo');
  }

  async shutdown(): Promise<'OK'> {
    return this.aria2.call('shutdown');
  }

  async forceShutdown(): Promise<'OK'> {
    return this.aria2.call('forceShutdown');
  }

  async saveSession(): Promise<'OK'> {
    return this.aria2.call('saveSession');
  }
  // Aria2 Notifications

  // Helper Methods
  getFileInfo(fileUrl: string): {
    name: string;
    type: Aria2ClientFileType;
  } {
    // TODO get file name
    const fileName: string = fileUrl;
    // TODO get file name
    let fileFormat: string;

    let fileType = Aria2ClientFileType.GENERAL;
    for (const key in this.fileTypes) {
      if (this.fileTypes[key].includes(fileFormat)) {
        fileType = key as Aria2ClientFileType;
      }
    }

    return {
      name: fileName,
      type: fileType,
    };
  }
}
