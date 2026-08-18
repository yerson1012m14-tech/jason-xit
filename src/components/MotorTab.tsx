import React, { useState } from 'react';
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
  Zap,
  Play,
  CornerDownLeft,
  Database,
  Layers,
  Wrench,
  UserCheck,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';

type MotorSubTab = 'status' | 'terminal' | 'memory' | 'processes' | 'tweaks';

export const MotorTab: React.FC = () => {
  const {
    engine,
    toggleEngine,
    activateEngine,
    reRunExploit,
    injectFilzaExtension,
    clearEngineLogs,
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
  } = useApp();

  const [subTab, setSubTab] = useState<MotorSubTab>('status');
  const [cmdInput, setCmdInput] = useState('');
  const [copiedLog, setCopiedLog] = useState(false);
  const [editingOffset, setEditingOffset] = useState<number | null>(null);
  const [editByteVal, setEditByteVal] = useState<string>('');

  const quickCommands = [
    'whoami',
    'uname -a',
    'kexploit',
    'ps',
    'ls /var/mobile',
    'inject_filza',
    'sandbox',
    'help',
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    executeTerminalCommand(cmdInput);
    setCmdInput('');
  };

  const handleQuickCmd = (cmd: string) => {
    executeTerminalCommand(cmd);
  };

  const handleCopyLogs = () => {
    const text = engine.logs.map(l => `[${l.time}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const memoryBytes = readMemoryBlock(inspectAddress);

  return (
    <div className="flex flex-1 flex-col items-center p-3 sm:p-4 pb-28 space-y-4 max-w-3xl mx-auto w-full">
      {/* Top Header */}
      <div className="mt-2 flex flex-col items-center">
        <Logo size={32} />
        <h2 className="mt-1 font-black text-lg tracking-[0.25em] text-white">
          MOTOR DE ACCESO
        </h2>
      </div>

      {/* Sub Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-1 overflow-x-auto rounded-xl border border-zinc-800 bg-[#0d0d0d] p-1 text-xs font-mono">
        <button
          onClick={() => setSubTab('status')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold whitespace-nowrap transition-all ${
            subTab === 'status'
              ? 'bg-red-950/60 text-[#ff3333] border border-red-800/80 shadow-[0_0_10px_rgba(255,26,26,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Diagnóstico</span>
        </button>

        <button
          onClick={() => setSubTab('terminal')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold whitespace-nowrap transition-all ${
            subTab === 'terminal'
              ? 'bg-red-950/60 text-[#ff3333] border border-red-800/80 shadow-[0_0_10px_rgba(255,26,26,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Terminal CLI</span>
        </button>

        <button
          onClick={() => setSubTab('memory')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold whitespace-nowrap transition-all ${
            subTab === 'memory'
              ? 'bg-red-950/60 text-[#ff3333] border border-red-800/80 shadow-[0_0_10px_rgba(255,26,26,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Memoria R/W</span>
        </button>

        <button
          onClick={() => setSubTab('processes')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold whitespace-nowrap transition-all ${
            subTab === 'processes'
              ? 'bg-red-950/60 text-[#ff3333] border border-red-800/80 shadow-[0_0_10px_rgba(255,26,26,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Procesos ({processes.length})</span>
        </button>

        <button
          onClick={() => setSubTab('tweaks')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold whitespace-nowrap transition-all ${
            subTab === 'tweaks'
              ? 'bg-red-950/60 text-[#ff3333] border border-red-800/80 shadow-[0_0_10px_rgba(255,26,26,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Parches</span>
        </button>
      </div>

      {/* SubTab: STATUS & DIAGNOSTICS */}
      {subTab === 'status' && (
        <div className="w-full space-y-4">
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

            <div className="pt-2 flex flex-wrap justify-center gap-2.5">
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

              <button
                onClick={reRunExploit}
                disabled={engine.isActivating}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 font-mono text-xs font-bold tracking-wider text-zinc-300 hover:border-red-500 hover:text-white transition-all"
                title="Reiniciar exploit y recargar primitivas"
              >
                <RefreshCw className={`h-4 w-4 text-amber-400 ${engine.isActivating ? 'animate-spin' : ''}`} />
                <span>RE-EJECUTAR EXPLOIT</span>
              </button>

              <button
                onClick={injectFilzaExtension}
                className="flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-2.5 font-mono text-xs font-bold tracking-wider text-red-400 hover:border-red-500 hover:text-white transition-all"
              >
                <Zap className="h-4 w-4 text-[#ff1a1a]" />
                <span>INYECTAR FILZA EXTENSION</span>
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
              <div className="space-y-1.5 font-mono text-[11px] text-zinc-400">
                <div className="flex justify-between">
                  <span>Target Arch:</span>
                  <span className="text-white font-semibold">arm64e (Apple Silicon)</span>
                </div>
                <div className="flex justify-between">
                  <span>Primitive Method:</span>
                  <span className="text-amber-400 font-semibold">{engine.stats.physrwMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Page Base:</span>
                  <span className="text-zinc-200">{engine.stats.pageTableBase}</span>
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
              <div className="space-y-1.5 font-mono text-[11px] text-zinc-400">
                <div className="flex justify-between">
                  <span>Self PID:</span>
                  <span className="text-white font-semibold">{engine.stats.pid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sandbox:</span>
                  <span className={engine.isActive ? 'text-green-400 font-bold' : 'text-amber-400'}>
                    {engine.isActive ? 'Escaped (Root Privileges)' : 'Jailed in Container'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Root Privileges:</span>
                  <span className={engine.isActive ? 'text-green-400 font-bold' : 'text-zinc-500'}>
                    {engine.isActive ? 'uid=0 (root) gid=0' : 'uid=501 (mobile)'}
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
                <span>Engine Output Logs ({engine.logs.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-white transition-colors p-1"
                  title="Copiar logs"
                >
                  {copiedLog ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLog ? 'Copiado' : 'Copiar'}</span>
                </button>
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
        </div>
      )}

      {/* SubTab: TERMINAL CLI */}
      {subTab === 'terminal' && (
        <div className="w-full space-y-3">
          {/* Quick command chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Comandos rápidos:</span>
            {quickCommands.map(qc => (
              <button
                key={qc}
                onClick={() => handleQuickCmd(qc)}
                className="rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 font-mono text-[11px] text-red-400 hover:border-red-500 hover:text-white transition-all"
              >
                {qc}
              </button>
            ))}
          </div>

          {/* Terminal Console View */}
          <div className="w-full rounded-2xl border border-red-900/60 bg-[#090909] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3.5 py-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-400">
                <Terminal className="h-4 w-4" />
                <span>jasonxit-sh (Darwin arm64e)</span>
              </div>
              <button
                onClick={clearTerminalHistory}
                className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                Limpiar pantalla
              </button>
            </div>

            <div className="p-3 min-h-[260px] max-h-[360px] overflow-y-auto space-y-2.5 font-mono text-xs">
              <div className="text-zinc-500 text-[11px]">
                JASON XIT Shell Environment [v2.0] — Escribe 'help' para ver todos los comandos.
              </div>

              {commandHistory.map((h, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-red-500 font-bold">jasonxit#</span>
                    <span className="text-white font-semibold">{h.command}</span>
                  </div>
                  <pre
                    className={`whitespace-pre-wrap pl-3 leading-relaxed text-[11px] ${
                      h.isError ? 'text-red-400' : 'text-zinc-300'
                    }`}
                  >
                    {h.output}
                  </pre>
                </div>
              ))}
            </div>

            {/* Input prompt */}
            <form onSubmit={handleCommandSubmit} className="flex items-center border-t border-zinc-800 bg-zinc-950/90 px-3 py-2">
              <span className="text-red-500 font-bold font-mono text-xs pr-2 select-none">
                jasonxit#
              </span>
              <input
                type="text"
                value={cmdInput}
                onChange={e => setCmdInput(e.target.value)}
                placeholder="Ingresa un comando (ej: uname, ps, kexploit, ls /var/mobile)..."
                className="flex-1 bg-transparent font-mono text-xs text-white placeholder-zinc-600 outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 text-red-500 hover:text-white transition-colors"
                title="Ejecutar"
              >
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SubTab: PHYSICAL MEMORY R/W */}
      {subTab === 'memory' && (
        <div className="w-full space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-400">
                <Database className="h-4 w-4" />
                <span>Inspector de Memoria Física & Paging</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-zinc-500">Dirección:</span>
                <select
                  value={inspectAddress}
                  onChange={e => {
                    setInspectAddress(e.target.value);
                    setEditingOffset(null);
                  }}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-white outline-none focus:border-red-500"
                >
                  <option value="0x180000000">0x180000000 (Page Table Base)</option>
                  <option value="0xfffffff0072b4c10">0xfffffff0072b4c10 (_allproc)</option>
                  <option value="0xfffffff0089a1000">0xfffffff0089a1000 (launchd proc)</option>
                  <option value="0xfffffff009cd3420">0xfffffff009cd3420 (selfProc / JasonXit)</option>
                </select>
              </div>
            </div>

            <p className="font-mono text-xs text-zinc-400">
              Primitivas de lectura y escritura física concedidas por <span className="text-amber-400">kexploit_opa334</span>. Haz clic en cualquier byte para parchearlo en tiempo real.
            </p>

            {/* Hex Dump Matrix */}
            <div className="rounded-xl border border-zinc-800 bg-black/90 p-3 font-mono text-xs overflow-x-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="text-zinc-500 text-[10px] border-b border-zinc-800 pb-1 flex justify-between">
                  <span>OFFSET</span>
                  <span>HEX BYTES (00 - 0F)</span>
                  <span>ASCII</span>
                </div>

                {[0, 16].map(rowOffset => {
                  const rowBytes = memoryBytes.slice(rowOffset, rowOffset + 16);
                  return (
                    <div key={rowOffset} className="flex items-center justify-between gap-2 py-0.5">
                      <span className="text-zinc-500 text-[11px] shrink-0">
                        +0x{rowOffset.toString(16).padStart(2, '0').toUpperCase()}
                      </span>

                      <div className="flex gap-1.5 sm:gap-2">
                        {rowBytes.map((byte, idx) => {
                          const absoluteOffset = rowOffset + idx;
                          const isEditing = editingOffset === absoluteOffset;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setEditingOffset(absoluteOffset);
                                setEditByteVal(byte.toString(16).padStart(2, '0').toUpperCase());
                              }}
                              className={`px-1 rounded text-center transition-all ${
                                isEditing
                                  ? 'bg-red-600 text-white font-bold'
                                  : byte === 0
                                  ? 'text-zinc-600 hover:text-zinc-300'
                                  : 'text-emerald-400 hover:bg-zinc-800'
                              }`}
                              title={`Offset +0x${absoluteOffset.toString(16)}: ${byte}`}
                            >
                              {byte.toString(16).padStart(2, '0').toUpperCase()}
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-zinc-400 text-[11px] shrink-0 font-mono tracking-widest hidden sm:inline">
                        {rowBytes.map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Byte Edit Form */}
            {editingOffset !== null && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-950/20 p-2 font-mono text-xs">
                <span className="text-zinc-300">
                  Editar byte en offset <span className="text-red-400">+0x{editingOffset.toString(16).toUpperCase()}</span>:
                </span>
                <input
                  type="text"
                  maxLength={2}
                  value={editByteVal}
                  onChange={e => setEditByteVal(e.target.value.toUpperCase())}
                  className="w-12 rounded border border-red-500 bg-zinc-900 px-2 py-1 text-center font-bold text-white outline-none"
                />
                <button
                  onClick={() => {
                    const parsed = parseInt(editByteVal, 16);
                    if (!isNaN(parsed)) {
                      writeMemoryByte(inspectAddress, editingOffset, parsed);
                    }
                    setEditingOffset(null);
                  }}
                  className="rounded bg-red-600 px-3 py-1 font-bold text-white hover:bg-red-500"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingOffset(null)}
                  className="rounded border border-zinc-700 px-2 py-1 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubTab: PROCESSES */}
      {subTab === 'processes' && (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase px-1">
            <span>Lista de Procesos en Ejecución ({processes.length})</span>
            <span>Acciones</span>
          </div>

          <div className="space-y-2">
            {processes.map(proc => (
              <div
                key={proc.pid}
                className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#101010] p-3 transition-all hover:border-red-900/60"
              >
                <div className="overflow-hidden pr-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                    <span>{proc.name}</span>
                    <span className="text-[10px] text-zinc-500">PID: {proc.pid}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        proc.uid === 0
                          ? 'bg-green-950/60 text-green-400 border border-green-800/50'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      UID: {proc.uid}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[10px] text-zinc-500 truncate">
                    <span>{proc.path}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-zinc-400">
                    <span>Mem: {proc.memory}</span>
                    <span>Threads: {proc.threads}</span>
                    <span className={proc.sandboxStatus === 'Escaped' ? 'text-green-400' : 'text-zinc-500'}>
                      Sandbox: {proc.sandboxStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {proc.uid !== 0 && (
                    <button
                      onClick={() => elevateProcess(proc.pid)}
                      className="flex items-center gap-1 rounded-lg border border-red-800/60 bg-red-950/30 px-2.5 py-1 font-mono text-[11px] font-bold text-red-300 hover:border-red-500 hover:text-white"
                      title="Elevar a root UID 0"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Root</span>
                    </button>
                  )}

                  {proc.pid !== 1 && proc.pid !== engine.stats.pid && (
                    <button
                      onClick={() => killProcess(proc.pid)}
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-900"
                      title="Terminar proceso"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab: TWEAKS & SANDBOX EXTENSIONS */}
      {subTab === 'tweaks' && (
        <div className="w-full space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase px-1">
            Parches del Sistema & Extensiones Inyectables
          </div>

          <div className="space-y-2.5">
            {tweaks.map(tweak => (
              <div
                key={tweak.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#101010] p-3.5 transition-all hover:border-red-900/60"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{tweak.name}</span>
                    <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-red-400">
                      {tweak.category}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-zinc-400 leading-snug">
                    {tweak.description}
                  </p>
                  <div className="font-mono text-[10px] text-zinc-600 truncate">
                    Ruta: {tweak.targetPath}
                  </div>
                </div>

                <button
                  onClick={() => toggleTweak(tweak.id)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold border transition-all ${
                    tweak.status === 'installed'
                      ? 'border-green-500/80 bg-green-950/40 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-red-500 hover:text-white'
                  }`}
                >
                  {tweak.status === 'installed' ? 'INSTALADO' : 'INACTIVO'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer warning */}
      <div className="font-mono text-[11px] text-zinc-500 text-center pt-2">
        ⚠ Motor de inyección de kernel sincronizado con bridge nativo de JASON XIT
      </div>
    </div>
  );
};

