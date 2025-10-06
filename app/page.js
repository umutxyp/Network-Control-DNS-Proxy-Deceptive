'use client';

import { useState, useEffect } from 'react';
import TitleBar from '../components/TitleBar';
import ControlPanel from '../components/ControlPanel';
import StatusDisplay from '../components/StatusDisplay';
import SettingsPanel from '../components/SettingsPanel';
import LogsPanel from '../components/LogsPanel';
import { useLanguage } from '../contexts/LanguageContext';

function HomeContent() {
  const [activeTab, setActiveTab] = useState('control');
  const { t } = useLanguage();
  const [dpiStatus, setDpiStatus] = useState({
    active: false,
    stats: {},
  });

  useEffect(() => {
    // Check DPI status on mount
    checkDPIStatus();
    
    // Poll status every 1 second for real-time stats
    const interval = setInterval(checkDPIStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkDPIStatus = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      try {
        const status = await window.electron.getDPIStatus();
        setDpiStatus(status);
      } catch (error) {
        console.error('Failed to get DPI status:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 text-white flex flex-col">
      <TitleBar />
      
      <main className="flex-1 flex flex-col p-6 space-y-6">
        {/* Header with logo and status */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 relative">
              <img src="/logo.png" alt="Shroudly" className="w-full h-full object-contain" />
              {dpiStatus.active && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse-slow" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                {t('appName')}
              </h1>
              <p className="text-sm text-gray-400 italic">{t('tagline')}</p>
            </div>
          </div>

          <StatusDisplay status={dpiStatus} />
        </header>

        {/* Navigation */}
        <nav className="flex space-x-2 border-b border-primary-800">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'control'
                ? 'bg-primary-500 text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white hover:bg-dark-400'
            }`}
          >
            {t('controlPanel')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-primary-500 text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white hover:bg-dark-400'
            }`}
          >
            {t('settings')}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'logs'
                ? 'bg-primary-500 text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white hover:bg-dark-400'
            }`}
          >
            {t('logs')}
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 fade-in">
          {activeTab === 'control' && <ControlPanel dpiStatus={dpiStatus} onStatusChange={checkDPIStatus} />}
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'logs' && <LogsPanel />}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 border-t border-dark-400 pt-4">
          <p>
            {t('appName')} {t('version')} - {t('madeBy')}
          </p>
          <p className="text-xs mt-1">
            {t('copyright')}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
