'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Toast from './Toast';

export default function ControlPanel({ dpiStatus, onStatusChange }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [config, setConfig] = useState({
    fragmentHTTP: true,
    fragmentHTTPS: true,
    fragmentSize: 2,
    ttlManipulation: true,
    ttlValue: 5,
    sniFragmentation: true,
    sniFakePackets: true,
    wrongChecksum: true,
    customDNS: true,
    dnsServers: ['1.1.1.1', '1.0.0.1'],
    autoMode: true,
    aggressiveMode: true, // All features enabled by default
  });

  useEffect(() => {
    loadSettings();
    
    // Reload settings when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadSettings = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      const saved = await window.electron.getAllSettings();
      if (saved && Object.keys(saved).length > 0) {
        setConfig(prev => ({ ...prev, ...saved }));
      }
    }
  };

  const updateSetting = async (key, value) => {
    // Update local state immediately
    setConfig(prev => ({ ...prev, [key]: value }));
    
    // Save to storage
    if (typeof window !== 'undefined' && window.electron) {
      await window.electron.setSetting(key, value);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      // Get latest settings before starting
      await loadSettings();
      
      const result = await window.electron.startDPI(config);
      if (result.success) {
        onStatusChange();
        setToast({ message: t('success') + '! DPI Bypass started', type: 'success' });
      } else {
        setToast({ message: `Error: ${result.error}`, type: 'error' });
      }
    } catch (error) {
      setToast({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const result = await window.electron.stopDPI();
      if (result.success) {
        onStatusChange();
        setToast({ message: 'DPI Bypass stopped', type: 'success' });
      } else {
        setToast({ message: `Error: ${result.error}`, type: 'error' });
      }
    } catch (error) {
      setToast({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Control */}
      <div className="glass-dark rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-primary-400">{t('dpiBypassControl')}</h2>
        
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
            dpiStatus.active ? 'bg-green-500/20 glow-strong' : 'bg-gray-700'
          } transition-all`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              dpiStatus.active ? 'bg-green-500' : 'bg-gray-600'
            } transition-all`}>
              {dpiStatus.active ? (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {dpiStatus.active ? (
                <span className="text-green-400">{t('active').toUpperCase()}</span>
              ) : (
                <span className="text-gray-400">{t('inactive').toUpperCase()}</span>
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {dpiStatus.active ? t('dpiBypassRunning') : t('dpiBypassStopped')}
            </p>
          </div>

          <div className="flex space-x-4 w-full">
            <button
              onClick={handleStart}
              disabled={dpiStatus.active || loading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                dpiStatus.active || loading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white glow'
              }`}
            >
              {loading ? t('starting') : t('start')}
            </button>
            <button
              onClick={handleStop}
              disabled={!dpiStatus.active || loading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !dpiStatus.active || loading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? t('stopping') : t('stop')}
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-3 border-t border-dark-400 pt-4">
          <h3 className="font-semibold text-primary-300">{t('quickSettings')}</h3>
          
          <label className="flex items-center justify-between">
            <span className="text-sm">{t('autoMode')}</span>
            <input
              type="checkbox"
              checked={config.autoMode}
              onChange={(e) => updateSetting('autoMode', e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">{t('aggressiveMode')}</span>
            <input
              type="checkbox"
              checked={config.aggressiveMode}
              onChange={(e) => updateSetting('aggressiveMode', e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </label>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-6">
        <div className="glass-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary-400 mb-4">{t('statistics')}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-400 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{t('uptime')}</p>
              <p className="text-2xl font-bold text-primary-300">
                {formatUptime(dpiStatus.stats?.uptime)}
              </p>
            </div>

            <div className="bg-dark-400 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{t('packetsProcessed')}</p>
              <p className="text-2xl font-bold text-primary-300">
                {(dpiStatus.stats?.packetsProcessed || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-dark-400 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{t('dataProcessed')}</p>
              <p className="text-2xl font-bold text-primary-300">
                {formatBytes(dpiStatus.stats?.bytesProcessed || 0)}
              </p>
            </div>

            <div className="bg-dark-400 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{t('connectionsSaved')}</p>
              <p className="text-2xl font-bold text-green-400">
                {(dpiStatus.stats?.connectionsSaved || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Active Techniques */}
        <div className="glass-dark rounded-lg p-6">
          <h3 className="font-semibold text-primary-300 mb-4">{t('activeTechniques')}</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">HTTP Fragmentation</span>
              <span className={`font-semibold ${config.fragmentHTTP ? 'text-green-400' : 'text-gray-600'}`}>
                {config.fragmentHTTP ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">HTTPS/SNI Fragmentation</span>
              <span className={`font-semibold ${config.fragmentHTTPS ? 'text-green-400' : 'text-gray-600'}`}>
                {config.fragmentHTTPS ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">TTL Manipulation</span>
              <span className={`font-semibold ${config.ttlManipulation ? 'text-green-400' : 'text-gray-600'}`}>
                {config.ttlManipulation ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Fake SNI Packets</span>
              <span className={`font-semibold ${config.sniFakePackets ? 'text-green-400' : 'text-gray-600'}`}>
                {config.sniFakePackets ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Wrong Checksum</span>
              <span className={`font-semibold ${config.wrongChecksum ? 'text-green-400' : 'text-gray-600'}`}>
                {config.wrongChecksum ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Custom DNS</span>
              <span className={`font-semibold ${config.customDNS ? 'text-green-400' : 'text-gray-600'}`}>
                {config.customDNS ? `✓ ${t('enabled')}` : `✗ ${t('disabled')}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
