'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function StatusDisplay({ status }) {
  const { t } = useLanguage();
  
  return (
    <div className="glass rounded-lg px-6 py-3 flex items-center space-x-4">
      <div className={`w-3 h-3 rounded-full ${
        status.active ? 'bg-green-500 animate-pulse-slow' : 'bg-gray-600'
      }`} />
      <div>
        <p className="text-xs text-gray-400">{t('status')}</p>
        <p className={`font-semibold ${status.active ? 'text-green-400' : 'text-gray-500'}`}>
          {status.active ? t('protected') : t('notProtected')}
        </p>
      </div>
    </div>
  );
}
