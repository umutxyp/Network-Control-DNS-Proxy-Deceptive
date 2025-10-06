'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SettingsPanel() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const languageSelectorRef = useRef(null);
  const [languageChangeNotif, setLanguageChangeNotif] = useState(false);
  const [settings, setSettings] = useState({
    // DPI Bypass Settings - All enabled by default
    fragmentHTTP: true,
    fragmentHTTPS: true,
    fragmentSize: 2,
    ttlManipulation: true,
    ttlValue: 5,
    sniFragmentation: true,
    sniFakePackets: true,
    wrongChecksum: true,
    wrongSeq: true,
    nativeFrag: true,
    reverseFrag: true,
    maxPayload: 1200,
    
    // DNS Settings - All enabled by default
    customDNS: true,
    dnsServers: ['1.1.1.1', '1.0.0.1'],
    dnsPoisonProtection: true,
    
    // Advanced - All enabled by default
    autoMode: true,
    aggressiveMode: true,
    autoStart: false, // Keep false for safety
    minimizeToTray: true,
    showNotifications: true,
  });

  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  // Close language selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target)) {
        setShowLanguageSelector(false);
      }
    };

    if (showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);

  const loadSettings = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      const saved = await window.electron.getAllSettings();
      if (saved) {
        setSettings({ ...settings, ...saved });
      }
    }
  };

  const saveSetting = async (key, value) => {
    // Optimistic update
    setSettings({ ...settings, [key]: value });
    
    if (typeof window !== 'undefined' && window.electron) {
      const result = await window.electron.setSetting(key, value);
      
      // Check if auto-start setting failed
      if (key === 'autoStart' && result && result.success === false) {
        // Revert the setting
        setSettings(prev => ({ ...prev, [key]: false }));
        
        // Show error message
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(result.error || 'Failed to set auto-start', 'error');
        } else {
          alert(result.error || 'Failed to set auto-start. Try running as administrator.');
        }
      }
    }
  };

  const saveAllSettings = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      for (const [key, value] of Object.entries(settings)) {
        await window.electron.setSetting(key, value);
      }
      alert(t('settingsSaved'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Language Selection */}
      <div className="glass-dark rounded-lg p-6 relative z-40 overflow-visible">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">{t('language')}</h2>
        
        <div className="relative z-50" ref={languageSelectorRef}>
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="w-full bg-dark-400 hover:bg-dark-300 px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
          >
            <span className="flex items-center space-x-3">
              <span className="text-2xl">{availableLanguages.find(l => l.code === language)?.flag}</span>
              <span>{availableLanguages.find(l => l.code === language)?.name}</span>
            </span>
            <svg className={`w-5 h-5 transition-transform ${showLanguageSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLanguageSelector && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[100]" 
                onClick={() => setShowLanguageSelector(false)}
              />
              {/* Dropdown */}
              <div 
                className="absolute z-[101] w-full mt-2 bg-dark-400 border border-primary-800 rounded-lg shadow-2xl max-h-96 overflow-y-auto thin-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageSelector(false);
                    // Show notification
                    setLanguageChangeNotif(true);
                    setTimeout(() => setLanguageChangeNotif(false), 3000);
                  }}
                  className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-dark-300 transition-colors ${
                    language === lang.code ? 'bg-primary-500' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <svg className="w-5 h-5 ml-auto text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
              </div>
            </>
          )}
        </div>

        {/* Language Change Notification */}
        {languageChangeNotif && (
          <div className="mt-4 bg-green-500 text-white px-4 py-3 rounded-lg flex items-center space-x-2 animate-fade-in">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{t('languageSaved')}</span>
          </div>
        )}
      </div>

      {/* DPI Bypass Techniques */}
      <div className="glass-dark rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">{t('dpiBypassTechniques')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('httpFragmentation')}</p>
              <p className="text-sm text-gray-400">{t('httpFragmentationDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.fragmentHTTP}
              onChange={(e) => saveSetting('fragmentHTTP', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('httpsFragmentation')}</p>
              <p className="text-sm text-gray-400">{t('httpsFragmentationDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.fragmentHTTPS}
              onChange={(e) => saveSetting('fragmentHTTPS', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('ttlManipulation')}</p>
              <p className="text-sm text-gray-400">{t('ttlManipulationDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.ttlManipulation}
              onChange={(e) => saveSetting('ttlManipulation', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('fakeSniPackets')}</p>
              <p className="text-sm text-gray-400">{t('fakeSniPacketsDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.sniFakePackets}
              onChange={(e) => saveSetting('sniFakePackets', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('wrongChecksum')}</p>
              <p className="text-sm text-gray-400">{t('wrongChecksumDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.wrongChecksum}
              onChange={(e) => saveSetting('wrongChecksum', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fragment Size</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.fragmentSize}
              onChange={(e) => saveSetting('fragmentSize', parseInt(e.target.value))}
              className="w-full bg-dark-400 px-4 py-2 rounded-lg border border-primary-800 focus:border-primary-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Number of fragments (1-10, default: 2)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">TTL Value</label>
            <input
              type="number"
              min="1"
              max="128"
              value={settings.ttlValue}
              onChange={(e) => saveSetting('ttlValue', parseInt(e.target.value))}
              className="w-full bg-dark-400 px-4 py-2 rounded-lg border border-primary-800 focus:border-primary-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Time To Live value (1-128, default: 5)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Payload Size</label>
            <input
              type="number"
              min="500"
              max="1500"
              step="100"
              value={settings.maxPayload}
              onChange={(e) => saveSetting('maxPayload', parseInt(e.target.value))}
              className="w-full bg-dark-400 px-4 py-2 rounded-lg border border-primary-800 focus:border-primary-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum packet payload (500-1500 bytes, default: 1200)</p>
          </div>
        </div>
      </div>

      {/* DNS Settings */}
      <div className="glass-dark rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">{t('dnsSettings')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('customDns')}</p>
              <p className="text-sm text-gray-400">{t('customDnsDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.customDNS}
              onChange={(e) => saveSetting('customDNS', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('dnsServers')}</label>
            <input
              type="text"
              value={settings.dnsServers.join(', ')}
              onChange={(e) => saveSetting('dnsServers', e.target.value.split(',').map(s => s.trim()))}
              className="w-full bg-dark-400 px-4 py-2 rounded-lg border border-primary-800 focus:border-primary-500 outline-none"
              placeholder="1.1.1.1, 1.0.0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple servers with commas</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">DNS Poison Protection</p>
              <p className="text-sm text-gray-400">Protect against DNS cache poisoning attacks</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dnsPoisonProtection}
              onChange={(e) => saveSetting('dnsPoisonProtection', e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass-dark rounded-lg p-6">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">{t('advanced')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('autoMode')}</p>
              <p className="text-sm text-gray-400">{t('autoModeDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoMode}
              onChange={(e) => saveSetting('autoMode', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('aggressiveMode')}</p>
              <p className="text-sm text-gray-400">{t('aggressiveModeDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.aggressiveMode}
              onChange={(e) => saveSetting('aggressiveMode', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('startOnBoot')}</p>
              <p className="text-sm text-gray-400">{t('startOnBootDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoStart}
              onChange={(e) => saveSetting('autoStart', e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{t('minimizeToTray')}</p>
              <p className="text-sm text-gray-400">{t('minimizeToTrayDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.minimizeToTray}
              onChange={(e) => saveSetting('minimizeToTray', e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAllSettings}
          className="bg-primary-500 hover:bg-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors glow"
        >
          {t('save')}
        </button>
      </div>
    </div>
  );
}
