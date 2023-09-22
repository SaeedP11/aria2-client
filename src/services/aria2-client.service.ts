/* Import */
import * as Aria2 from 'aria2';
// Interface
import {
  IAria2Config,
  IAria2Download,
  IAria2File,
  IAria2GlobalStat,
  IAria2Peer,
  IAria2Server,
  IAria2Uri,
} from '../interfaces/aria2.interface';

export default class Aria2Client {
  private readonly aria2: typeof Aria2;

  constructor(
    config: IAria2Config = {
      host: 'localhost',
      port: 6800,
      secure: false,
      secret: '',
      path: '/jsonrpc',
    },
  ) {
    this.aria2 = new Aria2(config);
  }

  async open(): Promise<Event> {
    return await this.aria2.open();
  }

  async close(): Promise<Event> {
    return await this.aria2.close();
  }
  // Aria2 Methods
  async addUri(
    uris: string[],
    { dir }: { dir: string },
  ): Promise<Record<string, string>> {
    return await this.aria2.call('addUri', uris, { dir });
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

  async tellStatus(
    gid: string,
    keys: string[] = undefined,
  ): Promise<IAria2Download> {
    return await this.aria2.call('tellStatus', gid, keys);
  }

  async getUris(gid: string): Promise<IAria2Uri[]> {
    return await this.aria2.call('tellStatus', gid);
  }

  async getFiles(gid: string): Promise<IAria2File[]> {
    return await this.aria2.call('getFiles', gid);
  }

  async getPeers(gid: string): Promise<IAria2Peer[]> {
    return await this.aria2.call('getPeers', gid);
  }

  async getServers(gid: string): Promise<IAria2Server[]> {
    return await this.aria2.call('getPeers', gid);
  }

  async tellActive(): Promise<IAria2Download[]> {
    return await this.aria2.call('tellActive');
  }

  async tellWaiting(offset: number, num: number): Promise<IAria2Download[]> {
    return await this.aria2.call('tellWaiting', offset, num);
  }

  async tellStopped(offset: number, num: number): Promise<IAria2Download[]> {
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
}
