'use client';

export default function TitleBar() {
  const handleMinimize = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.closeWindow();
    }
  };

  return (
    <div className="window-drag bg-dark-400 border-b border-primary-800 h-12 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        <img src="/icon-small.png" alt="Shroudly" className="w-6 h-6" />
        <span className="text-sm font-medium text-gray-300">Shroudly</span>
      </div>

      <div className="window-no-drag flex space-x-2">
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center hover:bg-dark-300 transition-colors rounded"
          aria-label="Minimize"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <rect x="4" y="9" width="12" height="2" />
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center hover:bg-dark-300 transition-colors rounded"
          aria-label="Maximize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <rect x="5" y="5" width="10" height="10" strokeWidth="2" />
          </svg>
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors rounded"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeWidth="2" d="M6 6l8 8M14 6l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
