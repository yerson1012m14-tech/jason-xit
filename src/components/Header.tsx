import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ShieldAlert, Cpu } from 'lucide-react';

export const Logo: React.FC<{ size?: number; showSubtitle?: boolean }> = ({
  size = 28,
  showSubtitle = false,
}) => {
  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="flex items-center gap-1.5 font-black tracking-tight transform -rotate-3 transition-transform hover:scale-105"
        style={{ fontSize: `${size}px` }}
      >
        <span className="text-[#ff1a1a] drop-shadow-[0_0_12px_rgba(255,26,26,0.85)]">
          JASON
        </span>
        <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          XIT
        </span>
      </div>
      {showSubtitle && (
        <span className="mt-1 text-[11px] font-bold tracking-[0.25em] text-red-400/70 font-mono">
          v2.0 • iOS 17-26
        </span>
      )}
    </div>
  );
};

export const Header: React.FC<{ title?: string; rightElement?: React.ReactNode }> = ({
  title,
  rightElement,
}) => {
  const { engine } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-red-950/40 bg-black/60 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Logo size={20} />
      </div>

      {title && (
        <div className="text-center font-bold tracking-wider text-xs uppercase text-zinc-300 font-mono">
          {title}
        </div>
      )}

      <div className="flex items-center gap-2">
        {rightElement ? (
          rightElement
        ) : (
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold font-mono tracking-wider transition-all border ${
              engine.isActive
                ? 'border-red-500/60 bg-red-950/40 text-[#ff3333] shadow-[0_0_10px_rgba(255,30,30,0.3)]'
                : 'border-zinc-700/60 bg-zinc-900/60 text-zinc-400'
            }`}
          >
            {engine.isActive ? (
              <>
                <Shield className="h-3 w-3 text-red-500 animate-pulse" />
                <span>MOTOR: ON</span>
              </>
            ) : engine.isActivating ? (
              <>
                <Cpu className="h-3 w-3 text-amber-400 animate-spin" />
                <span>ACTIVANDO...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3 w-3 text-zinc-400" />
                <span>MOTOR: OFF</span>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
