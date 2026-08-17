import React from 'react';
import { useApp } from '../context/AppContext';
import { MainTab } from '../types';
import { Folder, Zap, LayoutGrid, Sliders, Key } from 'lucide-react';

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: Array<{ id: MainTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'archivos',
      label: 'Archivos',
      icon: <Folder className="h-5 w-5" />,
    },
    {
      id: 'motor',
      label: 'Motor',
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      icon: <Sliders className="h-5 w-5" />,
    },
    {
      id: 'key',
      label: 'Key',
      icon: <Key className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-red-950/50 bg-[#0c0c0c]/90 px-2 py-1.5 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-[#ff1a1a] drop-shadow-[0_0_8px_rgba(255,26,26,0.6)]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#ff1a1a] shadow-[0_0_4px_#ff1a1a]" />
                )}
              </div>
              <span className="mt-1 font-mono text-[10px] font-bold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
