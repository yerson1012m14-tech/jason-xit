import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppRoute,
  MainTab,
  FSItem,
  AppEntry,
  EngineState,
  LicenseState,
  TweakPatch,
} from '../types';
import { INITIAL_APPS, VIRTUAL_FILESYSTEM } from '../data/mockFilesystem';
import {
  triggerHaptic,
  sounds,
  KernelProcess,
  INITIAL_KERNEL_PROCESSES,
} from '../utils/engineBridge';

export interface TerminalCommandOutput {
  command: string;
  output: string;
  isError?: boolean;
}

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
  reRunExploit: () => Promise<void>;
  injectFilzaExtension: () => Promise<boolean>;

  // Processes
  processes: KernelProcess[];
  killProcess: (pid: number) => void;
  elevateProcess: (pid: number) => void;

  // Tweaks
  tweaks: TweakPatch[];
  toggleTweak: (id: string) => void;

  // Terminal Execution
  commandHistory: TerminalCommandOutput[];
  executeTerminalCommand: (input: string) => string;
  clearTerminalHistory: () => void;

  // Memory & Physical RW
  inspectAddress: string;
  setInspectAddress: (addr: string) => void;
  readMemoryBlock: (addr: string) => number[];
  writeMemoryByte: (addr: string, offset: number, byteVal: number) => void;

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
  chmodItem: (name: string, perms: string) => void;

  // Apps
  apps: AppEntry[];
  appSearchQuery: string;
  setAppSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_TWEAKS: TweakPatch[] = [
  {
    id: 'house-arrest-mha',
    name: 'MobileHouseArrest Service Hook (com.apple.mobile.MobileHouseArrest)',
    description: 'Bypass de aislamiento de contenedores para lectura/escritura directa en Application Data (mha-c2)',
    status: 'installed',
    targetPath: '/System/Library/Lockdown/Services.plist',
    category: 'Daemon / AFC',
  },
  {
    id: 'afc2-root',
    name: 'Apple File Conduit 2 (AFC2 Daemon)',
    description: 'Servidor AFC2 con privilegios de root para transferencia de datos y mods sin restricciones',
    status: 'installed',
    targetPath: '/usr/libexec/afcd',
    category: 'Daemon / AFC',
  },
  {
    id: 'filza-root',
    name: 'Filza Root Sandbox Extension',
    description: 'Extiende el sandbox de Filza File Manager para acceso root sin restricciones',
    status: 'installed',
    targetPath: '/Applications/Filza.app',
    category: 'FileSystem',
  },
  {
    id: 'posterboard-caml',
    name: 'PosterBoard CAML Lockscreen Hook',
    description: 'Permite wallpapers interactivos y widgets avanzados en iOS PosterBoard',
    status: 'installed',
    targetPath: '/var/mobile/Library/PosterBoard',
    category: 'SpringBoard',
  },
  {
    id: 'dynamic-island-mod',
    name: 'Dynamic Island Neon Controller',
    description: 'Inyecta visualizadores de estado de kernel en la Dynamic Island',
    status: 'not_installed',
    targetPath: '/System/Library/CoreServices/SpringBoard.app',
    category: 'UI / Themes',
  },
  {
    id: 'tcc-bypass',
    name: 'TCC Privacy Permission Root Bypass',
    description: 'Concede permisos a fotos, contactos y contenedores sin pedir confirmación',
    status: 'installed',
    targetPath: '/Library/TCC/TCC.db',
    category: 'Kernel',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>('splash');
  const [activeTab, setActiveTabState] = useState<MainTab>('archivos');

  const setActiveTab = (tab: MainTab) => {
    triggerHaptic('soft');
    setActiveTabState(tab);
  };

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
    triggerHaptic('medium');
    setNeonThemeState(v);
    localStorage.setItem('jx_neon', String(v));
  };

  const [expirationNotice, setExpirationNoticeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('jx_aviso');
    return saved !== null ? saved === 'true' : true;
  });
  const setExpirationNotice = (v: boolean) => {
    triggerHaptic('medium');
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
      pageTableBase: '0x180000000',
      physrwMethod: 'kexploit_opa334_smrptr',
    },
  });

  // Processes & Tweaks State
  const [processes, setProcesses] = useState<KernelProcess[]>(INITIAL_KERNEL_PROCESSES);
  const [tweaks, setTweaks] = useState<TweakPatch[]>(DEFAULT_TWEAKS);

  // Terminal & CLI State
  const [commandHistory, setCommandHistory] = useState<TerminalCommandOutput[]>([
    {
      command: 'uname -a',
      output: 'Darwin Jason-iPhone 23.5.0 Darwin Kernel Version 23.5.0: xnu-10063.121.3~3/RELEASE_ARM64_T8130 arm64e',
    },
    {
      command: 'whoami',
      output: 'root (uid=0, gid=0) - JASON XIT Engine Sandbox Escaped',
    },
  ]);

  // Memory & Physical RW State
  const [inspectAddress, setInspectAddress] = useState<string>('0x180000000');
  const [memoryOverrides, setMemoryOverrides] = useState<Record<string, number[]>>({});

  // Filesystem State
  const [fsData, setFsData] = useState<Record<string, FSItem[]>>(VIRTUAL_FILESYSTEM);
  const [currentPath, setCurrentPath] = useState<string>('__root__');
  const [viewingFile, setViewingFile] = useState<{ item: FSItem; fullPath: string } | null>(null);

  // Apps State
  const [apps] = useState<AppEntry[]>(INITIAL_APPS);
  const [appSearchQuery, setAppSearchQuery] = useState<string>('mha-c2');

  // Key validation & activation
  const activateKey = useCallback((rawKey: string): boolean => {
    const clean = rawKey.trim().toUpperCase();
    const regex = /^([A-Z0-9]{4}-){3}[A-Z0-9]{4}$/;
    if (!regex.test(clean)) {
      sounds.playWarn();
      triggerHaptic('heavy');
      return false;
    }
    const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
    setLicenseKey(clean);
    setLicenseExp(exp);
    localStorage.setItem('jx_key', clean);
    localStorage.setItem('jx_exp', String(exp));
    sounds.playSuccess();
    triggerHaptic('rigid');
    return true;
  }, []);

  const renewKey = useCallback(() => {
    const base = Math.max(Date.now(), licenseExp);
    const newExp = base + 30 * 24 * 60 * 60 * 1000;
    setLicenseExp(newExp);
    localStorage.setItem('jx_exp', String(newExp));
    sounds.playSuccess();
    triggerHaptic('rigid');
  }, [licenseExp]);

  const logoutKey = useCallback(() => {
    setLicenseKey(null);
    setLicenseExp(0);
    localStorage.removeItem('jx_key');
    localStorage.removeItem('jx_exp');
    setRoute('key');
    triggerHaptic('heavy');
  }, []);

  const generateSampleKey = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    sounds.playClick(1400);
    triggerHaptic('soft');
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
    triggerHaptic('rigid');

    const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
      setEngine(prev => ({
        ...prev,
        logs: [...prev.logs, { time: timeStr, text, type }],
      }));
    };

    addLog('[*] Initializing JasonXit Kernel Engine v2.0...', 'info');
    sounds.playExploitPing(600);
    await new Promise(r => setTimeout(r, 350));

    addLog('[*] Executing kexploit_opa334() primitive on arm64e...', 'info');
    sounds.playExploitPing(750);
    await new Promise(r => setTimeout(r, 400));

    addLog('[+] Kernel physical rw primitive acquired at 0x180000000', 'success');
    sounds.playExploitPing(900);
    await new Promise(r => setTimeout(r, 300));

    addLog('[*] Resolving symbol: find_kernel_symbol("_allproc")...', 'info');
    await new Promise(r => setTimeout(r, 350));

    addLog('[+] _allproc resolved at 0xfffffff0072b4c10', 'success');
    sounds.playExploitPing(1100);
    await new Promise(r => setTimeout(r, 300));

    addLog('[*] Iterating SMR proc list for PID 2841 & launchd PID 1...', 'info');
    await new Promise(r => setTimeout(r, 350));

    addLog('[+] Found selfProc: 0xfffffff009cd3420, launchd: 0xfffffff0089a1000', 'success');
    await new Promise(r => setTimeout(r, 300));

    addLog('[*] Executing sandbox_escape(selfProc)...', 'info');
    sounds.playExploitPing(1300);
    await new Promise(r => setTimeout(r, 350));

    addLog('[+] Sandbox escaped. Applying root elevation (uid 0, gid 0)...', 'success');
    await new Promise(r => setTimeout(r, 300));

    addLog('[+] sandbox_elevate_to_root() success! Filza sandbox extension active.', 'success');
    addLog('[+] Hooking MobileHouseArrest (com.apple.mobile.MobileHouseArrest) container service...', 'success');
    addLog('[+] AFC2 daemon connected: Access to /var/mobile/Containers/Data/Application enabled.', 'success');
    addLog('[✓] MOTOR ACTIVO — Acceso total al sistema de archivos concedido.', 'success');

    sounds.playSuccess();
    triggerHaptic('rigid');

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
      triggerHaptic('heavy');
      sounds.playWarn();
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

  const reRunExploit = useCallback(async () => {
    triggerHaptic('heavy');
    setEngine(prev => ({
      ...prev,
      isActive: false,
      logs: [
        ...prev.logs,
        {
          time: new Date().toLocaleTimeString(),
          text: '[*] Reiniciando exploit de kernel...',
          type: 'warn',
        },
      ],
    }));
    await new Promise(r => setTimeout(r, 300));
    await activateEngine();
  }, [activateEngine]);

  const injectFilzaExtension = useCallback(async (): Promise<boolean> => {
    triggerHaptic('rigid');
    sounds.playExploitPing(1200);
    const now = new Date().toLocaleTimeString();
    setEngine(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          time: now,
          text: '[*] Inyectando extensión de sandbox para com.tigisoftware.Filza...',
          type: 'info',
        },
        {
          time: now,
          text: '[+] /var/mobile/Containers sandbox rule patched: read-write-any granted.',
          type: 'success',
        },
      ],
    }));
    sounds.playSuccess();
    return true;
  }, []);

  const clearEngineLogs = useCallback(() => {
    triggerHaptic('soft');
    setEngine(prev => ({
      ...prev,
      logs: [{ time: '00:00.00', text: 'Logs cleared.', type: 'info' }],
    }));
  }, []);

  // Process list operations
  const killProcess = (pid: number) => {
    triggerHaptic('heavy');
    sounds.playWarn();
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    setEngine(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          time: new Date().toLocaleTimeString(),
          text: `[!] Proceso PID ${pid} terminado via SIGKILL (kernel primitive).`,
          type: 'warn',
        },
      ],
    }));
  };

  const elevateProcess = (pid: number) => {
    triggerHaptic('rigid');
    sounds.playSuccess();
    setProcesses(prev =>
      prev.map(p => {
        if (p.pid === pid) {
          return { ...p, uid: 0, sandboxStatus: 'Escaped' };
        }
        return p;
      })
    );
    setEngine(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          time: new Date().toLocaleTimeString(),
          text: `[+] Proceso PID ${pid} elevado a root (uid=0) y sandbox escapado.`,
          type: 'success',
        },
      ],
    }));
  };

  // Tweaks operations
  const toggleTweak = (id: string) => {
    triggerHaptic('medium');
    setTweaks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'installed' ? 'not_installed' : 'installed';
          if (nextStatus === 'installed') {
            sounds.playSuccess();
          } else {
            sounds.playWarn();
          }
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Memory inspect simulation
  const readMemoryBlock = (addr: string): number[] => {
    if (memoryOverrides[addr]) {
      return memoryOverrides[addr];
    }
    // Generate deterministic bytes based on address
    const hash = Array.from(addr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bytes: number[] = [];
    for (let i = 0; i < 32; i++) {
      bytes.push((hash * (i + 13) * 31 + i * 17) % 256);
    }
    return bytes;
  };

  const writeMemoryByte = (addr: string, offset: number, byteVal: number) => {
    triggerHaptic('soft');
    sounds.playClick(1500);
    const current = readMemoryBlock(addr);
    const updated = [...current];
    updated[offset] = Math.max(0, Math.min(255, byteVal));
    setMemoryOverrides(prev => ({
      ...prev,
      [addr]: updated,
    }));
  };

  // Terminal command execution
  const executeTerminalCommand = (input: string): string => {
    const raw = input.trim();
    if (!raw) return '';
    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    triggerHaptic('soft');
    let out = '';
    let isErr = false;

    switch (cmd) {
      case 'help':
        out = `Comandos de JASON XIT Motor v2.0:
  whoami            - Muestra el usuario y permisos actuales
  uname -a          - Información del Kernel Darwin y arquitectura
  kexploit          - Estado de las primitivas de exploit y physical R/W
  ps                - Lista de procesos de kernel activos
  ls [ruta]         - Lista archivos y carpetas del sistema
  cat <archivo>     - Muestra el contenido de un archivo
  pwd               - Directorio de trabajo actual
  inject_filza      - Inyecta la extensión de sandbox para Filza
  sandbox           - Estado del sandbox container
  allproc           - Muestra el puntero de la lista global de procesos
  clear             - Limpia la pantalla de terminal
  reboot_userspace  - Reinicia procesos de usuario (launchd)
  key_status        - Muestra el estado de la licencia activa`;
        break;

      case 'whoami':
        out = engine.isActive
          ? 'root (uid=0, gid=0) - JASON XIT Sandbox Root Elevation Active'
          : 'mobile (uid=501, gid=501) - Jailed in application sandbox';
        break;

      case 'uname':
        out = 'Darwin Jason-iPhone 23.5.0 Darwin Kernel Version 23.5.0: xnu-10063.121.3~3/RELEASE_ARM64_T8130 arm64e';
        break;

      case 'kexploit':
      case 'exploit':
        out = `[kexploit_opa334 Status]
  Primitive Method: kexploit_opa334_smrptr
  Physical Page Base: 0x180000000
  Root Status: ${engine.isActive ? 'ELEVATED (UID 0)' : 'JAILED (UID 501)'}
  Allproc Address: ${engine.stats.allproc}
  Self Proc: ${engine.stats.selfProc}
  Launchd Proc: ${engine.stats.launchdProc}`;
        break;

      case 'pwd':
        out = currentPath === '__root__' ? '/' : currentPath;
        break;

      case 'ls': {
        const target = args[0] || (currentPath === '__root__' ? '/var/mobile' : currentPath);
        const items = fsData[target];
        if (items) {
          out = items.map(i => `${i.permissions || 'rwxr-xr-x'}  ${i.size || '<DIR>'}  ${i.name}`).join('\n');
        } else {
          out = `ls: ${target}: No such directory or restricted path`;
          isErr = true;
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          out = 'usage: cat <filename>';
          isErr = true;
          break;
        }
        const fileName = args[0];
        const dir = currentPath === '__root__' ? '/var/mobile' : currentPath;
        const file = fsData[dir]?.find(i => i.name === fileName);
        if (file) {
          out = file.content || `[Binary content, size: ${file.size}]`;
        } else {
          out = `cat: ${fileName}: No such file or directory`;
          isErr = true;
        }
        break;
      }

      case 'ps':
        out = `PID    PPID   UID   THREADS  MEMORY    SANDBOX      NAME
${processes.map(p => `${String(p.pid).padEnd(6)} ${String(p.ppid).padEnd(6)} ${String(p.uid).padEnd(5)} ${String(p.threads).padEnd(8)} ${p.memory.padEnd(9)} ${p.sandboxStatus.padEnd(12)} ${p.name}`).join('\n')}`;
        break;

      case 'inject_filza':
        injectFilzaExtension();
        out = '[+] Extensión Filza inyectada exitosamente con permisos root.';
        break;

      case 'sandbox':
        out = engine.isActive ? 'STATUS: ESCAPED (Full Root Read/Write)' : 'STATUS: JAILED (Restricted App Sandbox)';
        break;

      case 'allproc':
        out = `_allproc symbol address: ${engine.stats.allproc}`;
        break;

      case 'clear':
        setCommandHistory([]);
        return '';

      case 'key_status':
        out = `Licencia activa: ${licenseKey ?? 'Ninguna'}
Tiempo restante: ${getRemainingString()}`;
        break;

      case 'reboot_userspace':
        reRunExploit();
        out = '[*] Userspace rebooted via launchd signal.';
        break;

      default:
        out = `zsh: command not found: ${cmd}. Escribe 'help' para ver la lista de comandos disponibles.`;
        isErr = true;
    }

    setCommandHistory(prev => [...prev, { command: raw, output: out, isError: isErr }]);
    return out;
  };

  const clearTerminalHistory = () => {
    triggerHaptic('soft');
    setCommandHistory([]);
  };

  // Auto-boot & Auto-activate engine on startup like Swift app
  useEffect(() => {
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

  // Filesystem navigation logic
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
    triggerHaptic('soft');
    sounds.playClick(900);
    setCurrentPath(path);
  };

  const navigateUp = () => {
    triggerHaptic('soft');
    sounds.playClick(800);
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
    triggerHaptic('rigid');
    sounds.playSuccess();

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
    triggerHaptic('heavy');
    sounds.playWarn();
    setFsData(prev => {
      const existing = prev[currentPath] || [];
      return {
        ...prev,
        [currentPath]: existing.filter(i => i.name !== name),
      };
    });
  };

  const chmodItem = (name: string, perms: string) => {
    if (currentPath === '__root__') return;
    triggerHaptic('rigid');
    sounds.playClick(1300);
    setFsData(prev => {
      const existing = prev[currentPath] || [];
      return {
        ...prev,
        [currentPath]: existing.map(i => (i.name === name ? { ...i, permissions: perms } : i)),
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
        reRunExploit,
        injectFilzaExtension,
        processes,
        killProcess,
        elevateProcess,
        tweaks,
        toggleTweak,
        commandHistory,
        executeTerminalCommand,
        clearTerminalHistory,
        inspectAddress,
        setInspectAddress,
        readMemoryBlock,
        writeMemoryByte,
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
        chmodItem,
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

