import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Header';
import { Key, RefreshCw, LogOut, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';

export const KeyStatusTab: React.FC = () => {
  const { license, getRemainingString, renewKey, logoutKey } = useApp();
  const [ticker, setTicker] = useState(getRemainingString());
  const [renewMessage, setRenewMessage] = useState(false);

  // Live timer tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(getRemainingString());
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingString]);

  const handleRenew = () => {
    renewKey();
    setTicker(getRemainingString());
    setRenewMessage(true);
    setTimeout(() => setRenewMessage(false), 3000);
  };

  const isExpired = ticker === 'EXPIRADA';

  return (
    <div className="flex flex-1 flex-col items-center p-4 pb-28 space-y-5 max-w-xl mx-auto w-full">
      <div className="mt-2 flex flex-col items-center">
        <Logo size={32} />
        <h2 className="mt-2 font-black text-lg tracking-[0.25em] text-white">
          ESTADO DE TU KEY
        </h2>
      </div>

      {/* Main License Card matching Swift layout */}
      <div className="w-full rounded-2xl border-2 border-red-500/70 bg-[#121212]/95 p-6 text-center shadow-[0_0_25px_rgba(255,26,26,0.25)] space-y-4">
        <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
          TIEMPO RESTANTE
        </div>

        <div
          className={`font-mono text-2xl sm:text-3xl font-black tracking-wider transition-all ${
            isExpired
              ? 'text-red-500'
              : 'text-[#ff1a1a] drop-shadow-[0_0_16px_rgba(255,26,26,0.9)]'
          }`}
        >
          {ticker}
        </div>

        {/* Separator */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7a0000] to-transparent" />

        <div className="space-y-1.5 font-mono text-sm">
          <div className="text-zinc-300">
            <span className="text-zinc-500">KEY: </span>
            <span className="text-white font-bold">{license.key ?? '—'}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 font-bold">
            <span className="text-zinc-500">ESTADO: </span>
            <span className={!isExpired ? 'text-green-400' : 'text-red-500'}>
              {!isExpired ? 'ACTIVA' : 'EXPIRADA'}
            </span>
          </div>
        </div>

        {renewMessage && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-green-400 font-bold animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>¡Key renovada con éxito por 30 días más!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 pt-2">
        <button
          onClick={handleRenew}
          className="w-full rounded-xl border-2 border-[#ff1a1a] bg-gradient-to-r from-[#5a0000] to-[#b30000] py-3.5 font-black tracking-[0.25em] text-white shadow-[0_0_20px_rgba(255,26,26,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          RENOVAR KEY
        </button>

        <button
          onClick={logoutKey}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#0f0f0f] py-3 font-mono text-xs font-bold text-zinc-400 transition-all hover:border-red-900 hover:text-white"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>CAMBIAR O CERRAR KEY</span>
        </button>
      </div>

      <div className="pt-4 font-mono text-[11px] text-zinc-500 text-center">
        JASON XIT v2.0 • iOS 17-26
      </div>
    </div>
  );
};
