import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Header';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Terminal,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
} from 'lucide-react';

export const MotorTab: React.FC = () => {
  const { engine, toggleEngine, activateEngine, clearEngineLogs } = useApp();

  return (
    <div className="flex flex-1 flex-col items-center p-4 pb-28 space-y-5 max-w-2xl mx-auto w-full">
      <div className="mt-2 flex flex-col items-center">
        <Logo size={32} />
        <h2 className="mt-2 font-black text-lg tracking-[0.25em] text-white">
          MOTOR DE ACCESO
        </h2>
      </div>

      {/* Main Status Hero Card */}
      <div className="w-full rounded-2xl border-2 border-red-500/70 bg-[#121212]/95 p-5 text-center shadow-[0_0_25px_rgba(255,26,26,0.25)] space-y-3.5">
        <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
          ESTADO DEL MOTOR
        </div>

        <div
          className={`font-mono text-3xl sm:text-4xl font-black tracking-widest transition-all ${
            engine.isActive
              ? 'text-[#ff1a1a] drop-shadow-[0_0_16px_rgba(255,26,26,0.9)]'
              : engine.isActivating
              ? 'text-amber-400 animate-pulse'
              : 'text-zinc-500'
          }`}
        >
          {engine.isActive ? 'ACTIVO' : engine.isActivating ? 'ACTIVANDO...' : 'DESACTIVADO'}
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7a0000] to-transparent" />

        <p className="font-mono text-xs text-zinc-300 px-2">
          {engine.errorMessage ??
            (engine.isActive
              ? 'Motor activo — acceso total al sistema de archivos y sandbox escape concedido'
              : 'Se activa automáticamente al abrir la app o mediante el botón inferior')}
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => (engine.isActive ? toggleEngine() : activateEngine())}
            disabled={engine.isActivating}
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 font-mono text-xs font-bold tracking-wider transition-all ${
              engine.isActive
                ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-red-500 hover:text-white'
                : 'border-[#ff1a1a] bg-gradient-to-r from-[#7a0000] to-[#b30000] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)] hover:scale-105'
            }`}
          >
            {engine.isActive ? (
              <>
                <ShieldAlert className="h-4 w-4 text-zinc-400" />
                <span>DESACTIVAR MOTOR</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-red-400" />
                <span>{engine.isActivating ? 'ACTIVANDO...' : 'ACTIVAR MOTOR'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Kernel Diagnostics & Process Stats */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800/80 bg-[#101010] p-3.5 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-400">
            <Cpu className="h-4 w-4" />
            <span>Kernel & Exploit Stats</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Target Arch:</span>
              <span className="text-white font-semibold">arm64e (A17 Pro)</span>
            </div>
            <div className="flex justify-between">
              <span>Primitive:</span>
              <span className="text-amber-400">kexploit_opa334</span>
            </div>
            <div className="flex justify-between">
              <span>Page Base:</span>
              <span className="text-zinc-200">0x180000000</span>
            </div>
            <div className="flex justify-between">
              <span>Allproc Symbol:</span>
              <span className="text-emerald-400">{engine.stats.allproc}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#101010] p-3.5 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-400">
            <Activity className="h-4 w-4" />
            <span>Privileges & Status</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Self PID:</span>
              <span className="text-white font-semibold">{engine.stats.pid}</span>
            </div>
            <div className="flex justify-between">
              <span>Sandbox:</span>
              <span className={engine.isActive ? 'text-green-400 font-bold' : 'text-amber-400'}>
                {engine.isActive ? 'Escaped (Root)' : 'Jailed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Root Privileges:</span>
              <span className={engine.isActive ? 'text-green-400 font-bold' : 'text-zinc-500'}>
                {engine.isActive ? 'uid=0 (root)' : 'uid=501 (mobile)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>OS Target:</span>
              <span className="text-zinc-200">{engine.stats.osVersion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Live Output Console */}
      <div className="w-full rounded-2xl border border-zinc-800 bg-[#0c0c0c] overflow-hidden shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3.5 py-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-300">
            <Terminal className="h-3.5 w-3.5 text-red-500" />
            <span>Engine Output Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearEngineLogs}
              className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              title="Limpiar logs"
            >
              <Trash2 className="h-3 w-3" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        <div className="p-3 max-h-60 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          {engine.logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-zinc-600 shrink-0 select-none">[{log.time}]</span>
              <span
                className={
                  log.type === 'success'
                    ? 'text-emerald-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : log.type === 'error'
                    ? 'text-red-500'
                    : 'text-zinc-300'
                }
              >
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="font-mono text-[11px] text-zinc-500 text-center">
        ⚠ Se activa automáticamente, como en Filza File Manager
      </div>
    </div>
  );
};
