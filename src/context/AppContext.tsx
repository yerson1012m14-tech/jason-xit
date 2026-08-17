import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppRoute, MainTab, FSItem, AppEntry, EngineState, LicenseState } from '../types';
import { INITIAL_APPS, VIRTUAL_FILESYSTEM } from '../data/mockFilesystem';

interface AppContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  
  // License
  license: LicenseState;
  activateKey: (key: string) => boolean;
  renewKey: () => void;
  logoutKey: () => void;
  generateSampleKey: () => string;
  getRemainingString: () => string;

  // Engine
  engine: EngineState;
  activateEngine: () => Promise<boolean>;
  toggleEngine: () => void;
  clearEngineLogs: () => void;

  // Settings
  neonTheme: boolean;
  setNeonTheme: (v: boolean) => void;
  expirationNotice: boolean;
  setExpirationNotice: (v: boolean) => void;

  // Filesystem
  currentPath: string;
  setCurrentPath: (p: string) => void;
  currentItems: FSItem[];
  isRestricted: boolean;
  navigateTo: (path: string) => void;
  navigateUp: () => void;
  viewingFile: { item: FSItem; fullPath: string } | null;
  setViewingFile: (file: { item: FSItem; fullPath: string } | null) => void;
  createItem: (name: string, isDir: boolean, content?: string) => void;
  deleteItem: (name: string) => void;

  // Apps
  apps: AppEntry[];
  appSearchQuery: string;
  setAppSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>('splash');
  const [activeTab, setActiveTab] = useState<MainTab>('archivos');

  // License State
  const [licenseKey, setLicenseKey] = useState<string | null>(() => localStorage.getItem('jx_key'));
  const [licenseExp, setLicenseExp] = useState<number>(() => {
    const saved = localStorage.getItem('jx_exp');
    return saved ? Number(saved) : 0;
  });

  const isLicenseActive = Boolean(licenseKey && licenseExp > Date.now());

  // Settings State
  const [neonTheme, setNeonThemeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('jx_neon');
    return saved !== null ? saved === 'true' : true;
  });
  const setNeonTheme = (v: boolean) => {
    setNeonThemeState(v);
    localStorage.setItem('jx_neon', String(v));
  };

  const [expirationNotice, setExpirationNoticeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('jx_aviso');
    return saved !== null ? saved === 'true' : true;
  });
  const setExpirationNotice = (v: boolean) => {
    setExpirationNoticeState(v);
    localStorage.setItem('jx_aviso', String(v));
  };

  // Engine State
  const [engine, setEngine] = useState<EngineState>({
    isActive: false,
    isActivating: false,
    errorMessage: null,
    logs: [
      { time: '00:00.00', text: 'JASON XIT Engine core initialized (Darwin Kernel arm64e)', type: 'info' }
    ],
    stats: {
      pid: 2841,
      allproc: '0xfffffff0072b4c10',
      launchdProc: '0xfffffff0089a1000 (PID 1)',
      selfProc: '0xfffffff009cd3420 (PID 2841)',
      sandboxStatus: 'Active Sandbox Container (Jailed)',
      rootPrivileges: false,
      memoryUsage: '34.2 MB / 8.0 GB',
      osVersion: 'iOS 17.5.1 (21F90)',
      uptime: '14d 06h 42m',
    },
  });

  // Filesystem State
  const [fsData, setFsData] = useState<Record<string, FSItem[]>>(VIRTUAL_FILESYSTEM);
  const [currentPath, setCurrentPath] = useState<string>('__root__');
  const [viewingFile, setViewingFile] = useState<{ item: FSItem; fullPath: string } | null>(null);

  // Apps State
  const [apps] = useState<AppEntry[]>(INITIAL_APPS);
  const [appSearchQuery, setAppSearchQuery] = useState<string>('');

  // Key validation & activation
  const activateKey = useCallback((rawKey: string): boolean => {
    const clean = rawKey.trim().toUpperCase();
    const regex = /^([A-Z0-9]{4}-){3}[A-Z0-9]{4}$/;
    if (!regex.test(clean)) {
      return false;
    }
    const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
    setLicenseKey(clean);
    setLicenseExp(exp);
    localStorage.setItem('jx_key', clean);
    localStorage.setItem('jx_exp', String(exp));
    return true;
  }, []);

  const renewKey = useCallback(() => {
    const base = Math.max(Date.now(), licenseExp);
    const newExp = base + 30 * 24 * 60 * 60 * 1000;
    setLicenseExp(newExp);
    localStorage.setItem('jx_exp', String(newExp));
  }, [licenseExp]);

  const logoutKey = useCallback(() => {
    setLicenseKey(null);
    setLicenseExp(0);
    localStorage.removeItem('jx_key');
    localStorage.removeItem('jx_exp');
    setRoute('key');
  }, []);

  const generateSampleKey = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
  }, []);

  const getRemainingString = useCallback(() => {
    const diff = licenseExp - Date.now();
    if (diff <= 0) return 'EXPIRADA';
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [licenseExp]);

  // Engine activation simulation matching Engine.swift logic
  const activateEngine = useCallback(async (): Promise<boolean> => {
    if (engine.isActive) return true;
    setEngine(prev => ({ ...prev, isActivating: true, errorMessage: null }));

    const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
      setEngine(prev => ({
        ...prev,
        logs: [...prev.logs, { time: timeStr, text, type }],
      }));
    };

    addLog('[*] Initializing JasonXit Kernel Engine v2.0...', 'info');
    await new Promise(r => setTimeout(r, 400));

    addLog('[*] Executing kexploit_opa334() primitive on arm64e...', 'info');
    await new Promise(r => setTimeout(r, 500));

    addLog('[+] Kernel physical rw primitive acquired at 0x180000000', 'success');
    await new Promise(r => setTimeout(r, 350));

    addLog('[*] Resolving symbol: find_kernel_symbol("_allproc")...', 'info');
    await new Promise(r => setTimeout(r, 400));

    addLog('[+] _allproc resolved at 0xfffffff0072b4c10', 'success');
    await new Promise(r => setTimeout(r, 350));

    addLog('[*] Iterating SMR proc list for PID 2841 & launchd PID 1...', 'info');
    await new Promise(r => setTimeout(r, 450));

    addLog('[+] Found selfProc: 0xfffffff009cd3420, launchd: 0xfffffff0089a1000', 'success');
    await new Promise(r => setTimeout(r, 350));

    addLog('[*] Executing sandbox_escape(selfProc)...', 'info');
    await new Promise(r => setTimeout(r, 400));

    addLog('[+] Sandbox escaped. Applying root elevation (uid 0, gid 0)...', 'success');
    await new Promise(r => setTimeout(r, 350));

    addLog('[+] sandbox_elevate_to_root() success! Filza sandbox extension active.', 'success');
    addLog('[✓] MOTOR ACTIVO — Acceso total al sistema de archivos concedido.', 'success');

    setEngine(prev => ({
      ...prev,
      isActive: true,
      isActivating: false,
      errorMessage: null,
      stats: {
        ...prev.stats,
        sandboxStatus: 'Escaped (Sandbox root elevation active)',
        rootPrivileges: true,
      },
    }));

    return true;
  }, [engine.isActive]);

  const toggleEngine = useCallback(() => {
    if (engine.isActive) {
      setEngine(prev => ({
        ...prev,
        isActive: false,
        stats: {
          ...prev.stats,
          sandboxStatus: 'Active Sandbox Container (Jailed)',
          rootPrivileges: false,
        },
        logs: [
          ...prev.logs,
          {
            time: new Date().toLocaleTimeString(),
            text: '[!] Motor desactivado manualmente. Sandbox restaurado.',
            type: 'warn',
          },
        ],
      }));
    } else {
      activateEngine();
    }
  }, [engine.isActive, activateEngine]);

  const clearEngineLogs = useCallback(() => {
    setEngine(prev => ({
      ...prev,
      logs: [{ time: '00:00.00', text: 'Logs cleared.', type: 'info' }],
    }));
  }, []);

  // Auto-boot & Auto-activate engine on startup like Swift app
  useEffect(() => {
    // Check key and auto start engine
    const timer = setTimeout(() => {
      if (isLicenseActive) {
        setRoute('main');
        activateEngine();
      } else {
        setRoute('key');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // Filesystem navigation logic matching Views.swift
  const isElevatedPath = (p: string) => {
    const elevated = ['/var', '/Applications', '/System', '/private', '/usr', '/Library'];
    return elevated.some(e => p === e || p.startsWith(e + '/'));
  };

  const isRestricted = !engine.isActive && isElevatedPath(currentPath);

  const currentItems = React.useMemo(() => {
    if (currentPath === '__root__') {
      return [];
    }
    return fsData[currentPath] || [];
  }, [currentPath, fsData]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    if (currentPath === '/' || currentPath === '/var/mobile') {
      setCurrentPath('__root__');
      return;
    }
    if (currentPath === '__root__') return;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length <= 1) {
      setCurrentPath('/');
    } else {
      parts.pop();
      setCurrentPath('/' + parts.join('/'));
    }
  };

  const createItem = (name: string, isDir: boolean, content: string = '') => {
    if (currentPath === '__root__') return;
    const newItem: FSItem = {
      name,
      isDirectory: isDir,
      size: isDir ? undefined : `${content.length} B`,
      permissions: isDir ? 'rwxr-xr-x' : 'rw-r--r--',
      modified: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: isDir ? 'directory' : (name.endsWith('.plist') ? 'plist' : name.endsWith('.json') ? 'json' : 'text'),
      content: isDir ? undefined : content,
    };

    setFsData(prev => {
      const existing = prev[currentPath] || [];
      const updated = [...existing.filter(i => i.name !== name), newItem].sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });
      const newFs = { ...prev, [currentPath]: updated };
      if (isDir) {
        const fullNewDir = `${currentPath === '/' ? '' : currentPath}/${name}`;
        newFs[fullNewDir] = [];
      }
      return newFs;
    });
  };

  const deleteItem = (name: string) => {
    if (currentPath === '__root__') return;
    setFsData(prev => {
      const existing = prev[currentPath] || [];
      return {
        ...prev,
        [currentPath]: existing.filter(i => i.name !== name),
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        activeTab,
        setActiveTab,
        license: {
          key: licenseKey,
          expires: licenseExp,
          isActive: isLicenseActive,
        },
        activateKey,
        renewKey,
        logoutKey,
        generateSampleKey,
        getRemainingString,
        engine,
        activateEngine,
        toggleEngine,
        clearEngineLogs,
        neonTheme,
        setNeonTheme,
        expirationNotice,
        setExpirationNotice,
        currentPath,
        setCurrentPath,
        currentItems,
        isRestricted,
        navigateTo,
        navigateUp,
        viewingFile,
        setViewingFile,
        createItem,
        deleteItem,
        apps,
        appSearchQuery,
        setAppSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
