/* Import */
import { PlatformPath } from 'path';

export interface IAria2ClientOptions {
  defaultDir?: string;
  libs?: {
    os: NodeJS.Module['exports'];
    fs: NodeJS.Module['exports'];
    path: PlatformPath;
  };
  config?: {
    host: string;
    port: number;
    secure: boolean;
    secret: string;
    path: string;
  };
}
