import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Header';
import { BackgroundFX } from './BackgroundFX';
import { Key, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const KeyActivationView: React.FC = () => {
  const { activateKey, generateSampleKey, setRoute, activateEngine } = useApp();
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    const clean = raw.replace(/[^A-Z0-9]/g, '').slice(0, 16);
    
    // Format into XXXX-XXXX-XXXX-XXXX
    let formatted = '';
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += clean[i];
    }
    
    setKeyInput(formatted);
    if (error) setError('');
  };

  const handleActivate = () => {
    if (!keyInput) {
      setError('⚠ POR FAVOR INGRESA UNA KEY');
      return;
    }
    const ok = activateKey(keyInput);
    if (ok) {
      setError('');
      setSuccess(true);
      setTimeout(() => {
        setRoute('main');
        activateEngine();
      }, 700);
    } else {
      setError('⚠ KEY INVÁLIDA (Formato: XXXX-XXXX-XXXX-XXXX)');
    }
  };

  const handleAutoFillDemo = () => {
    const sample = generateSampleKey();
    setKeyInput(sample);
    setError('');
  };

  return (
    <BackgroundFX>
      <div className="flex flex-1 flex-col items-center justify-between p-6 select-none max-w-md mx-auto w-full">
        {/* Top & Logo */}
        <div className="mt-12 flex flex-col items-center">
          <Logo size={42} />
        </div>

        {/* Main Activation Card */}
        <div className="w-full flex flex-col items-center space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black tracking-[0.25em] text-white">
              INGRESA TU KEY
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Licencia de 30 días con acceso ilimitado
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="relative">
              <input
                type="text"
                value={keyInput}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                maxLength={19}
                className={`w-full bg-[#141414] border ${
                  error
                    ? 'border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]'
                    : 'border-zinc-700/80 focus:border-[#ff1a1a] focus:shadow-[0_0_15px_rgba(255,26,26,0.4)]'
                } rounded-xl px-4 py-3.5 text-center font-mono text-base font-bold tracking-widest text-white placeholder-zinc-600 outline-none transition-all`}
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>

            {/* Error or Success indicator */}
            <div className="min-h-[22px] flex items-center justify-center">
              {error ? (
                <div className="flex items-center gap-1 text-xs font-bold text-red-500 font-mono">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{error}</span>
                </div>
              ) : success ? (
                <div className="flex items-center gap-1 text-xs font-bold text-green-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ACTIVADO CORRECTAMENTE</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Activate button */}
          <button
            onClick={handleActivate}
            className="w-full rounded-xl border-2 border-[#ff1a1a] bg-gradient-to-r from-[#5a0000] to-[#b30000] py-3.5 font-black tracking-[0.25em] text-white shadow-[0_0_20px_rgba(255,26,26,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(255,26,26,0.8)] active:scale-[0.98]"
          >
            ACTIVAR
          </button>

          {/* Demo helper */}
          <button
            onClick={handleAutoFillDemo}
            className="flex items-center gap-1.5 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-[11px] font-mono font-semibold text-red-300/80 transition-colors hover:border-red-500 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Generar Key de Demostración</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pb-4 text-center font-mono text-[11px] text-zinc-500">
          JASON XIT v2.0 • iOS 17-26
        </div>
      </div>
    </BackgroundFX>
  );
};
