import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppEntry, FSItem } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  AppWindow,
  Lock,
  Search,
  Folder,
  FileCode,
  FileText,
  FileBox,
  Compass,
  MessageSquare,
  Instagram,
  Music,
  Bot,
  PlayCircle,
  Package,
  Terminal,
} from 'lucide-react';

export const AppDataTab: React.FC = () => {
  const {
    engine,
    activateEngine,
    apps,
    appSearchQuery,
    setAppSearchQuery,
    navigateTo,
    setViewingFile,
  } = useApp();

  const [selectedApp, setSelectedApp] = useState<AppEntry | null>(null);
  const [containerPath, setContainerPath] = useState<string | null>(null);

  const filteredApps = apps.filter(
    app =>
      app.name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.bundleId.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="h-5 w-5 text-red-500" />;
      case 'Folder':
        return <Folder className="h-5 w-5 text-amber-500" />;
      case 'Package':
        return <Package className="h-5 w-5 text-indigo-400" />;
      case 'Compass':
        return <Compass className="h-5 w-5 text-blue-400" />;
      case 'MessageSquare':
        return <MessageSquare className="h-5 w-5 text-emerald-400" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'Music':
        return <Music className="h-5 w-5 text-emerald-400" />;
      case 'Bot':
        return <Bot className="h-5 w-5 text-violet-400" />;
      case 'PlayCircle':
        return <PlayCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AppWindow className="h-5 w-5 text-red-400" />;
    }
  };

  const handleOpenAppContainer = (app: AppEntry) => {
    setSelectedApp(app);
    setContainerPath(app.dataPath);
    // Also navigate in main filesystem
    navigateTo(app.dataPath);
  };

  const handleBackToApps = () => {
    setSelectedApp(null);
    setContainerPath(null);
  };

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* App Data Header */}
      <div className="border-b border-red-950/40 bg-zinc-950/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedApp && (
              <button
                onClick={handleBackToApps}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/60 bg-[#140505] text-[#ff3333] transition-all hover:bg-red-950/40 hover:scale-105 active:scale-95"
                title="Volver a Apps"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="font-mono text-xs font-semibold text-zinc-300 truncate">
              {selectedApp ? `${selectedApp.name} (${selectedApp.bundleId})` : 'Contenedores de Apps'}
            </div>
          </div>

          <div className="font-mono text-xs font-bold text-[#ff1a1a] tracking-wider uppercase">
            APP DATA
          </div>
        </div>

        {/* Search Apps Filter */}
        {!selectedApp && (
          <div className="mt-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={appSearchQuery}
                onChange={e => setAppSearchQuery(e.target.value)}
                placeholder="Buscar aplicación o bundle ID..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 py-1.5 pl-8 pr-8 font-mono text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
              />
              {appSearchQuery && (
                <button
                  onClick={() => setAppSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
              <span className="text-zinc-500 text-[10px] shrink-0">Filtro rápido:</span>
              <button
                onClick={() => setAppSearchQuery('mha-c2')}
                className={`px-2.5 py-0.5 rounded-md border transition-all shrink-0 ${
                  appSearchQuery.toLowerCase() === 'mha-c2'
                    ? 'border-red-500 bg-red-950/60 text-red-400 font-bold shadow-[0_0_8px_rgba(255,26,26,0.3)]'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                🎮 MHA-C2 (Auto)
              </button>
              <button
                onClick={() => setAppSearchQuery('')}
                className={`px-2 py-0.5 rounded-md border transition-all shrink-0 ${
                  appSearchQuery === ''
                    ? 'border-zinc-700 bg-zinc-800 text-white font-bold'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Todas ({apps.length})
              </button>
              <button
                onClick={() => setAppSearchQuery('filza')}
                className={`px-2 py-0.5 rounded-md border transition-all shrink-0 ${
                  appSearchQuery.toLowerCase() === 'filza'
                    ? 'border-red-500 bg-red-950/60 text-red-400 font-bold'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                Filza
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {!engine.isActive ? (
          /* Jailed / Engine Inactive State */
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/50 bg-red-950/30 text-[#ff1a1a] shadow-[0_0_20px_rgba(255,26,26,0.3)]">
              <Lock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-black tracking-widest text-white">
                ACTIVANDO MOTOR...
              </h3>
              <p className="mt-1 text-xs font-mono text-zinc-400">
                Se requiere el sandbox escape para leer contenedores de /var/mobile/Containers
              </p>
            </div>
            <button
              onClick={() => activateEngine()}
              className="rounded-xl border border-[#ff1a1a] bg-gradient-to-r from-[#7a0000] to-[#b30000] px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-white shadow-[0_0_15px_rgba(255,26,26,0.4)]"
            >
              ACTIVAR MOTOR
            </button>
          </div>
        ) : !selectedApp ? (
          /* App List */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider text-zinc-500 uppercase px-1">
              <span>Aplicaciones Instaladas ({filteredApps.length})</span>
              <span>Tamaño</span>
            </div>

            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => handleOpenAppContainer(app)}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#101010] p-3 text-left transition-all hover:border-red-500/50 hover:bg-[#161616] group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-red-900/80">
                    {getAppIcon(app.icon)}
                  </div>
                  <div className="truncate">
                    <div className="font-mono text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {app.name}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 truncate">
                      {app.bundleId} • v{app.version}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="font-mono text-[11px] text-zinc-400">{app.size}</span>
                  <ChevronRight className="h-4 w-4 text-[#ff1a1a]/70 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* App Detail & Container Inspector */
          <div className="space-y-4">
            <div className="rounded-xl border border-red-900/50 bg-red-950/10 p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-red-900/80">
                  {getAppIcon(selectedApp.icon)}
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">{selectedApp.name}</h3>
                  <div className="font-mono text-xs text-zinc-400">{selectedApp.bundleId}</div>
                  <div className="font-mono text-[10px] text-red-400/90">{selectedApp.category}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 space-y-1 font-mono text-[11px] text-zinc-400">
                <div className="truncate">
                  <span className="text-zinc-500">Data Container: </span>
                  <span className="text-zinc-300">{selectedApp.dataPath}</span>
                </div>
                <div className="truncate">
                  <span className="text-zinc-500">Bundle Path: </span>
                  <span className="text-zinc-300">{selectedApp.bundlePath}</span>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-zinc-300 uppercase px-1">
              Contenido del Contenedor Sandbox
            </div>

            {/* Folder shortcuts for the app container */}
            <div className="space-y-2">
              <button
                onClick={() => navigateTo(`${selectedApp.dataPath}/Documents`)}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-800 bg-[#101010] p-3 text-left hover:border-red-500/40 hover:bg-[#151515]"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-red-400" />
                  <div>
                    <div className="font-mono text-xs font-bold text-white">Documents/</div>
                    <div className="font-mono text-[10px] text-zinc-500">Archivos y bases de datos del usuario</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-red-500" />
              </button>

              <button
                onClick={() => navigateTo(`${selectedApp.dataPath}/Library`)}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-800 bg-[#101010] p-3 text-left hover:border-red-500/40 hover:bg-[#151515]"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-red-400" />
                  <div>
                    <div className="font-mono text-xs font-bold text-white">Library/</div>
                    <div className="font-mono text-[10px] text-zinc-500">Preferences, Caches, Cookies & State</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-red-500" />
              </button>

              <button
                onClick={() => navigateTo(`${selectedApp.dataPath}/tmp`)}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-800 bg-[#101010] p-3 text-left hover:border-red-500/40 hover:bg-[#151515]"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-red-400" />
                  <div>
                    <div className="font-mono text-xs font-bold text-white">tmp/</div>
                    <div className="font-mono text-[10px] text-zinc-500">Archivos temporales</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
