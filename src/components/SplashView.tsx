import React, { useEffect, useState } from 'react';
import { Logo } from './Header';
import { BackgroundFX } from './BackgroundFX';

export const SplashView: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BackgroundFX>
      <div className="flex flex-1 flex-col items-center justify-center p-6 select-none">
        <div className="flex flex-col items-center gap-8">
          <Logo size={60} showSubtitle={true} />

          {/* Glowing Capsule Loading Bar */}
          <div className="relative h-2.5 w-64 overflow-hidden rounded-full border border-red-500/60 bg-zinc-950/80 shadow-[0_0_15px_rgba(255,26,26,0.3)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7a0000] via-[#d60000] to-[#ff1a1a] transition-all duration-[1600ms] ease-out shadow-[0_0_12px_#ff1a1a]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.3em] text-white/80 animate-pulse">
            <span>CARGANDO...</span>
          </div>
        </div>

        <div className="absolute bottom-8 font-mono text-[11px] text-zinc-500 tracking-wider">
          JASON XIT ENGINE • KERNEL ACCESS PLATFORM
        </div>
      </div>
    </BackgroundFX>
  );
};
