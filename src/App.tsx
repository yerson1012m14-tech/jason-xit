import React from 'react';
import { useApp } from './context/AppContext';
import { BackgroundFX } from './components/BackgroundFX';
import { Header } from './components/Header';
import { SplashView } from './components/SplashView';
import { KeyActivationView } from './components/KeyActivationView';
import { ArchivosTab } from './components/ArchivosTab';
import { MotorTab } from './components/MotorTab';
import { AppDataTab } from './components/AppDataTab';
import { AjustesTab } from './components/AjustesTab';
import { KeyStatusTab } from './components/KeyStatusTab';
import { TabBar } from './components/TabBar';
import { FileViewerModal } from './components/FileViewerModal';

export const MainAppContent: React.FC = () => {
  const { route, activeTab } = useApp();

  if (route === 'splash') {
    return <SplashView />;
  }

  if (route === 'key') {
    return <KeyActivationView />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'archivos':
        return <ArchivosTab />;
      case 'motor':
        return <MotorTab />;
      case 'apps':
        return <AppDataTab />;
      case 'ajustes':
        return <AjustesTab />;
      case 'key':
        return <KeyStatusTab />;
      default:
        return <ArchivosTab />;
    }
  };

  return (
    <BackgroundFX>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{renderActiveTab()}</main>
        <TabBar />
        <FileViewerModal />
      </div>
    </BackgroundFX>
  );
};

export function App() {
  return <MainAppContent />;
}

export default App;
