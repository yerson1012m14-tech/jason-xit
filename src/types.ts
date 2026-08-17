export type AppRoute = 'splash' | 'key' | 'main';

export type MainTab = 'archivos' | 'motor' | 'apps' | 'ajustes' | 'key';

export interface FSItem {
  name: string;
  isDirectory: boolean;
  size?: string;
  permissions?: string;
  modified?: string;
  content?: string;
  type?: 'text' | 'plist' | 'json' | 'image' | 'binary' | 'directory';
}

export interface AppEntry {
  id: string;
  name: string;
  bundleId: string;
  version: string;
  category: string;
  dataPath: string;
  bundlePath: string;
  size: string;
  icon: string;
}

export interface EngineStats {
  pid: number;
  allproc: string;
  launchdProc: string;
  selfProc: string;
  sandboxStatus: string;
  rootPrivileges: boolean;
  memoryUsage: string;
  osVersion: string;
  uptime: string;
}

export interface EngineState {
  isActive: boolean;
  isActivating: boolean;
  errorMessage: string | null;
  logs: Array<{ time: string; text: string; type: 'info' | 'success' | 'warn' | 'error' }>;
  stats: EngineStats;
}

export interface LicenseState {
  key: string | null;
  expires: number; // timestamp in ms
  isActive: boolean;
}
