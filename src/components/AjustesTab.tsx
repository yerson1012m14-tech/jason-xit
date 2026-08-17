import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Header';
import {
  Bolt,
  Flame,
  Bell,
  Key,
  Shield,
  Smartphone,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

export const AjustesTab: React.FC = () => {
  const {
    engine,
    toggleEngine,
    neonTheme,
    setNeonTheme,
    expirationNotice,
    setExpirationNotice,
    license,
    getRemainingString,
    setActiveTab,
  } = useApp();

  return (
    <div className="flex flex-1 flex-col items-center p-4 pb-28 space-y-4 max-w-xl mx-auto w-full">
      <div className="mt-2 flex flex-col items-center">
        <Logo size={32} />
        <h2 className="mt-2 font-black text-lg tracking-[0.25em] text-white">
          AJUSTES
        </h2>
      </div>

      <div className="w-full space-y-2.5">
        {/* Motor Row */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121212] p-3.5 transition-all hover:border-red-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/40 border border-red-900/60 text-[#ff1a1a]">
              <Bolt className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white">Motor de acceso</div>
              <div className="font-mono text-[10px] text-zinc-500">
                kexploit_opa334 & Sandbox escape
              </div>
            </div>
          </div>
          <button
            onClick={toggleEngine}
            className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              engine.isActive
                ? 'border-red-500/80 bg-red-950/50 text-[#ff3333] shadow-[0_0_10px_rgba(255,26,26,0.3)]'
                : 'border-zinc-700 bg-zinc-900 text-zinc-400'
            }`}
          >
            {engine.isActive ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Theme Neon Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121212] p-3.5 transition-all hover:border-red-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/40 border border-red-900/60 text-[#ff1a1a]">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white">Tema neón</div>
              <div className="font-mono text-[10px] text-zinc-500">
                Efectos de resplandor carmesí y partículas
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={neonTheme}
              onChange={e => setNeonTheme(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff1a1a] peer-checked:shadow-[0_0_12px_#ff1a1a]"></div>
          </label>
        </div>

        {/* Expiration Notice Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121212] p-3.5 transition-all hover:border-red-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/40 border border-red-900/60 text-[#ff1a1a]">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white">Aviso de vencimiento</div>
              <div className="font-mono text-[10px] text-zinc-500">
                Notificar cuando la key esté por expirar
              </div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={expirationNotice}
              onChange={e => setExpirationNotice(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff1a1a] peer-checked:shadow-[0_0_12px_#ff1a1a]"></div>
          </label>
        </div>

        {/* License Shortcut Row */}
        <div
          onClick={() => setActiveTab('key')}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121212] p-3.5 cursor-pointer transition-all hover:border-red-500/50 hover:bg-[#161616]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/40 border border-red-900/60 text-[#ff1a1a]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white">Licencia activa</div>
              <div className="font-mono text-[10px] text-zinc-500">
                {license.key ? `Key: ${license.key}` : 'Sin licencia'}
              </div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-[#ff3333]">
            {getRemainingString()}
          </div>
        </div>
      </div>

      {/* System Information Card */}
      <div className="w-full rounded-2xl border border-zinc-800/90 bg-[#0f0f0f] p-4 space-y-2 font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-2 font-bold text-zinc-200">
          <Smartphone className="h-4 w-4 text-red-500" />
          <span>Información de Dispositivo</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div>
            <span className="text-zinc-500">Dispositivo: </span>
            <span className="text-zinc-300">iPhone 15 Pro Max</span>
          </div>
          <div>
            <span className="text-zinc-500">Versión: </span>
            <span className="text-zinc-300">iOS 17.5.1</span>
          </div>
          <div>
            <span className="text-zinc-500">Compilación: </span>
            <span className="text-zinc-300">21F90 (arm64e)</span>
          </div>
          <div>
            <span className="text-zinc-500">Applet: </span>
            <span className="text-[#ff4444]">JASON XIT v2.0</span>
          </div>
        </div>
      </div>

      <div className="pt-4 font-mono text-[11px] text-zinc-500 text-center">
        JASON XIT v2.0 • iOS 17-26
      </div>
    </div>
  );
};
