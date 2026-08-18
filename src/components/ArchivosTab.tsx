import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FSItem } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Folder,
  FileText,
  FileCode,
  FileBox,
  Image as ImageIcon,
  Lock,
  Plus,
  Trash2,
  Search,
  FilePlus,
  FolderPlus,
  ShieldAlert,
  Upload,
  KeyRound,
} from 'lucide-react';

export const ArchivosTab: React.FC = () => {
  const {
    currentPath,
    currentItems,
    isRestricted,
    navigateTo,
    navigateUp,
    engine,
    activateEngine,
    setViewingFile,
    createItem,
    deleteItem,
    chmodItem,
    apps,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'dir'>('file');
  const [newItemContent, setNewItemContent] = useState('');
  const [chmodModalItem, setChmodModalItem] = useState<FSItem | null>(null);
  const [chmodValue, setChmodValue] = useState('rwxr-xr-x');

  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (item: FSItem) => {
    if (item.isDirectory) return <Folder className="h-5 w-5 text-[#ff3333] fill-[#ff3333]/20" />;
    if (item.name.endsWith('.plist') || item.name.endsWith('.xml')) {
      return <FileCode className="h-5 w-5 text-amber-400" />;
    }
    if (item.name.endsWith('.json')) {
      return <FileCode className="h-5 w-5 text-emerald-400" />;
    }
    if (item.name.endsWith('.png') || item.name.endsWith('.jpg')) {
      return <ImageIcon className="h-5 w-5 text-blue-400" />;
    }
    if (item.name.endsWith('.zip') || item.name.endsWith('.tar') || item.type === 'binary') {
      return <FileBox className="h-5 w-5 text-purple-400" />;
    }
    return <FileText className="h-5 w-5 text-zinc-300" />;
  };

  const handleItemClick = (item: FSItem) => {
    const fullPath = `${currentPath === '/' ? '' : currentPath}/${item.name}`;
    if (item.isDirectory) {
      navigateTo(fullPath);
    } else {
      setViewingFile({ item, fullPath });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    createItem(newItemName.trim(), newItemType === 'dir', newItemContent);
    setNewItemName('');
    setNewItemContent('');
    setShowCreateModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      createItem(file.name, false, text || '');
    };
    reader.readAsText(file);
  };

  // Breadcrumb path parts
  const breadcrumbParts = currentPath === '__root__' ? [] : currentPath.split('/').filter(Boolean);

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Path Header Bar */}
      <div className="border-b border-red-950/40 bg-zinc-950/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {currentPath !== '__root__' && (
              <button
                onClick={navigateUp}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-900/60 bg-[#140505] text-[#ff3333] transition-all hover:bg-red-950/40 hover:scale-105 active:scale-95"
                title="Volver"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Clickable breadcrumbs */}
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-zinc-300 whitespace-nowrap overflow-x-auto py-0.5">
              {currentPath === '__root__' ? (
                <span className="text-white">JASON X2</span>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo('__root__')}
                    className="hover:text-red-400 text-zinc-500 transition-colors"
                  >
                    root
                  </button>
                  {breadcrumbParts.map((part, index) => {
                    const subPath = '/' + breadcrumbParts.slice(0, index + 1).join('/');
                    const isLast = index === breadcrumbParts.length - 1;
                    return (
                      <React.Fragment key={subPath}>
                        <span className="text-zinc-600">/</span>
                        <button
                          onClick={() => navigateTo(subPath)}
                          className={`hover:text-red-400 transition-colors ${
                            isLast ? 'text-red-400 font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {part}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons if inside a folder */}
          {currentPath !== '__root__' && !isRestricted && (
            <div className="flex items-center gap-1.5 shrink-0">
              <label
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs font-mono text-zinc-300 hover:border-red-500 hover:text-white"
                title="Subir archivo"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Subir</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 rounded-lg border border-red-800/60 bg-red-950/30 px-2.5 py-1 text-xs font-mono font-bold text-[#ff4444] transition-all hover:border-[#ff1a1a] hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nuevo</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Search bar if in folder */}
        {currentPath !== '__root__' && !isRestricted && currentItems.length > 0 && (
          <div className="mt-2 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar en esta carpeta..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 py-1.5 pl-8 pr-3 font-mono text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
            />
          </div>
        )}
      </div>

      {/* Main Filesystem View */}
      <div className="flex-1 p-4">
        {currentPath === '__root__' ? (
          /* Root Selection View (Device Storage) */
          <div className="space-y-3">
            <button
              onClick={() => navigateTo('/var/mobile')}
              className="w-full flex items-center justify-between rounded-2xl border border-red-500/30 bg-[#121212] p-4 text-left shadow-lg transition-all hover:border-[#ff1a1a]/70 hover:bg-[#181818] hover:shadow-[0_0_15px_rgba(255,26,26,0.25)] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-950/40 border border-red-800/40 text-[#ff1a1a]">
                  <HardDrive className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-white">Device Storage</div>
                  <div className="font-mono text-xs text-zinc-500">/var/mobile (Almacenamiento de usuario)</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#ff1a1a]" />
            </button>

            {/* Featured Direct Game Access */}
            <div className="pt-1 text-[11px] font-bold font-mono tracking-wider text-red-400 uppercase px-1 flex items-center justify-between">
              <span>App Data Prioritaria</span>
              <span className="text-[9px] px-1.5 py-0.2 border border-red-500/40 rounded bg-red-950/50 text-red-300">AUTO MHA-C2</span>
            </div>

            <button
              onClick={() => navigateTo('/var/mobile/Containers/Data/Application/E84A12BC-33F1-4A92-BD81-893C2A9B11E4')}
              className="w-full flex items-center justify-between rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/40 via-[#160505] to-[#101010] p-3.5 text-left transition-all hover:border-red-400 hover:shadow-[0_0_15px_rgba(255,26,26,0.3)] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/40 border border-red-600/50 text-red-300 font-black text-sm">
                  🎮
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <span>MHA-C2 App Data</span>
                    <span className="text-[10px] text-red-400 font-mono font-normal">(com.sony.mha.c2)</span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">/var/mobile/.../E84A12BC-33F1-4A92-BD81-893C2A9B11E4</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400" />
            </button>

            {/* Quick shortcuts to system roots */}
            <div className="pt-2 text-[11px] font-bold font-mono tracking-wider text-zinc-500 uppercase px-1">
              Acceso Directo al Sistema
            </div>

            <button
              onClick={() => navigateTo('/var/mobile/Containers/Data/Application')}
              className="w-full flex items-center justify-between rounded-xl border border-red-900/50 bg-[#120a0a] p-3.5 text-left transition-all hover:border-red-600 hover:bg-[#180e0e] hover:shadow-[0_0_12px_rgba(255,26,26,0.2)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950 border border-red-700/60 text-red-400">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span>Todas las Apps (App Data)</span>
                    <span className="text-[10px] bg-red-950/80 border border-red-600/40 text-red-300 px-1.5 py-0.2 rounded">
                      {apps.length} Apps
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">/var/mobile/Containers/Data/Application</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400" />
            </button>

            <button
              onClick={() => navigateTo('/Applications')}
              className="w-full flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#0f0f0f] p-3 text-left transition-all hover:border-red-900 hover:bg-[#151515]"
            >
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-red-400" />
                <div>
                  <div className="font-mono text-xs font-bold text-zinc-200">System Applications (.app)</div>
                  <div className="font-mono text-[10px] text-zinc-500">/Applications</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </button>

            <button
              onClick={() => navigateTo('/var/mobile/Library/Preferences')}
              className="w-full flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#0f0f0f] p-3 text-left transition-all hover:border-red-900 hover:bg-[#151515]"
            >
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-red-400" />
                <div>
                  <div className="font-mono text-xs font-bold text-zinc-200">Preferences / Plists</div>
                  <div className="font-mono text-[10px] text-zinc-500">/var/mobile/Library/Preferences</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        ) : isRestricted ? (
          /* Restricted access warning matching Swift app */
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/50 bg-red-950/30 text-[#ff1a1a] shadow-[0_0_20px_rgba(255,26,26,0.3)]">
              <Lock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-black tracking-widest text-white">
                ACCESO RESTRINGIDO
              </h3>
              <p className="mt-1 text-xs font-mono text-zinc-400">
                Se requiere el Motor de Acceso activo para explorar rutas protegidas.
              </p>
            </div>
            <button
              onClick={() => activateEngine()}
              className="flex items-center gap-2 rounded-xl border border-[#ff1a1a] bg-gradient-to-r from-[#7a0000] to-[#b30000] px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-white shadow-[0_0_15px_rgba(255,26,26,0.4)] transition-all hover:scale-105"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>ACTIVAR MOTOR AHORA</span>
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center font-mono text-xs text-zinc-500">
            {searchQuery ? '— NINGÚN ARCHIVO COINCIDE CON LA BÚSQUEDA —' : '— CARPETA VACÍA —'}
          </div>
        ) : (
          /* Items List */
          <div className="space-y-2">
            {/* If inside /var/mobile/Containers/Data/Application, show helper info */}
            {currentPath === '/var/mobile/Containers/Data/Application' && (
              <div className="p-2.5 mb-2 rounded-lg border border-red-900/40 bg-red-950/20 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-300">
                  📁 Contenedores de Aplicaciones (<span className="text-red-400 font-bold">{filteredItems.length} detectadas</span>)
                </span>
                <span className="text-[10px] text-zinc-500">Mapeo UUID Automático</span>
              </div>
            )}

            {filteredItems.map(item => {
              // Resolve matching app if in /var/mobile/Containers/Data/Application
              const matchedApp =
                currentPath === '/var/mobile/Containers/Data/Application'
                  ? apps.find(a => a.dataPath.endsWith(item.name))
                  : null;

              const isMHA = matchedApp?.id === 'app-mha-c2' || item.name.includes('E84A12BC');

              return (
                <div
                  key={item.name}
                  className={`group flex items-center justify-between rounded-xl border transition-all ${
                    isMHA
                      ? 'border-red-500/80 bg-gradient-to-r from-red-950/40 via-[#160a0a] to-[#101010] shadow-[0_0_12px_rgba(255,26,26,0.25)]'
                      : 'border-zinc-800/80 bg-[#101010] hover:border-red-500/40 hover:bg-[#151515]'
                  } p-3`}
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    className="flex flex-1 items-center gap-3 text-left overflow-hidden"
                  >
                    <div className="shrink-0">
                      {isMHA ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/50 border border-red-500/60 text-base">
                          🎮
                        </div>
                      ) : matchedApp ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-base">
                          📱
                        </div>
                      ) : (
                        getFileIcon(item)
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-mono text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate flex items-center gap-2">
                        <span>{matchedApp ? matchedApp.name : item.name}</span>
                        {isMHA && (
                          <span className="text-[9px] bg-red-900/60 border border-red-500 text-red-200 px-1.5 py-0.2 rounded font-bold">
                            MHA-C2
                          </span>
                        )}
                        {matchedApp && !isMHA && (
                          <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded">
                            {matchedApp.version}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 truncate">
                        {matchedApp && (
                          <span className="text-red-400 font-mono font-medium">
                            {matchedApp.bundleId} •
                          </span>
                        )}
                        {matchedApp && (
                          <span className="text-zinc-500 truncate">{item.name} •</span>
                        )}
                        <span className="font-mono text-zinc-400">{item.permissions || 'rwxr-xr-x'}</span>
                        {item.size && <span>• {item.size}</span>}
                        {item.modified && <span className="hidden sm:inline">• {item.modified}</span>}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 pl-2">
                    <button
                      onClick={() => {
                        setChmodModalItem(item);
                        setChmodValue(item.permissions || 'rwxr-xr-x');
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-amber-400 transition-all rounded"
                      title="Cambiar permisos (chmod)"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => deleteItem(item.name)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-all rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {item.isDirectory ? (
                      <ChevronRight className="h-4 w-4 text-[#ff1a1a]/70 shrink-0" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chmod Permissions Modal */}
      {chmodModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border-2 border-red-500/60 bg-[#121212] p-5 shadow-[0_0_25px_rgba(255,26,26,0.3)]">
            <h3 className="font-mono text-sm font-bold tracking-wider text-white mb-2">
              PERMISOS (CHMOD)
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-4 truncate">
              {chmodModalItem.name}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Permisos UNIX (ej: rwxr-xr-x, rw-r--r--, rwxrwxrwx)
                </label>
                <input
                  type="text"
                  value={chmodValue}
                  onChange={e => setChmodValue(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['rwxr-xr-x (755)', 'rw-r--r-- (644)', 'rwxrwxrwx (777)'].map(preset => {
                  const val = preset.split(' ')[0];
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setChmodValue(val)}
                      className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-300 hover:border-red-500 hover:text-white"
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setChmodModalItem(null)}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 font-mono text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    chmodItem(chmodModalItem.name, chmodValue);
                    setChmodModalItem(null);
                  }}
                  className="rounded-lg border border-red-500 bg-[#7a0000] px-4 py-1.5 font-mono text-xs font-bold text-white shadow-[0_0_10px_rgba(255,26,26,0.3)] hover:bg-[#b30000]"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border-2 border-red-500/60 bg-[#121212] p-5 shadow-[0_0_25px_rgba(255,26,26,0.3)]">
            <h3 className="font-mono text-sm font-bold tracking-wider text-white mb-4">
              CREAR ELEMENTO EN {currentPath}
            </h3>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setNewItemType('file')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-xs font-bold transition-all border ${
                  newItemType === 'file'
                    ? 'border-red-500 bg-red-950/40 text-red-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <FilePlus className="h-4 w-4" />
                <span>Archivo</span>
              </button>
              <button
                type="button"
                onClick={() => setNewItemType('dir')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-xs font-bold transition-all border ${
                  newItemType === 'dir'
                    ? 'border-red-500 bg-red-950/40 text-red-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <FolderPlus className="h-4 w-4" />
                <span>Carpeta</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Nombre {newItemType === 'file' ? '(ej: config.plist, tweak.json)' : 'de la carpeta'}
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder={newItemType === 'file' ? 'nuevo_archivo.txt' : 'NuevaCarpeta'}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-red-500"
                />
              </div>

              {newItemType === 'file' && (
                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                    Contenido inicial (opcional)
                  </label>
                  <textarea
                    rows={4}
                    value={newItemContent}
                    onChange={e => setNewItemContent(e.target.value)}
                    placeholder="Escribe el texto o código del archivo..."
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-red-500"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 font-mono text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg border border-red-500 bg-[#7a0000] px-4 py-1.5 font-mono text-xs font-bold text-white shadow-[0_0_10px_rgba(255,26,26,0.3)] hover:bg-[#b30000]"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

