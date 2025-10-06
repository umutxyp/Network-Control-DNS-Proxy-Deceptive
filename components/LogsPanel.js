'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LogsPanel() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();

    // Listen for new logs
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.onNewLog((log) => {
        setLogs(prev => [...prev, log]);
      });

      return () => {
        window.electron.removeLogListener();
      };
    }
  }, []);

  const loadLogs = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      const systemLogs = await window.electron.getLogs();
      setLogs(systemLogs);
    }
  };

  const handleClearLogs = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      await window.electron.clearLogs();
      setLogs([]);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  return (
    <div className="glass-dark rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-400">{t('systemLogs')}</h2>
        
        <div className="flex space-x-2">
          {['all', 'info', 'success', 'warning', 'error'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-400 text-gray-400 hover:bg-dark-300'
              }`}
            >
              {t(level).charAt(0).toUpperCase() + t(level).slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-400 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t('noLogs')}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 hover:bg-dark-300 p-2 rounded transition-colors">
              <span className="text-gray-500 whitespace-nowrap">
                {new Date(log.time).toLocaleTimeString()}
              </span>
              <span className={getLevelColor(log.level)}>
                {getLevelIcon(log.level)}
              </span>
              <span className="flex-1 text-gray-300">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearLogs}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {t('clearLogs')}
        </button>
      </div>
    </div>
  );
}
