const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, protocol } = require('electron');
const path = require('path');
const Store = require('electron-store');
const DPIBypass = require('./dpi-bypass');
const fs = require('fs');
const url = require('url');

const store = new Store();
let mainWindow;
let tray = null;
let dpiBypass = null;
let systemLogs = [];
let currentOverlayColor = null;

// Configuration
const isDev = !app.isPackaged;
const PORT = process.env.PORT || 3000;

// Check if dev server is available
async function checkDevServer() {
  if (!isDev) return false;
  
  try {
    const http = require('http');
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${PORT}`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(1000, () => {
        req.destroy();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}

// Log function
function addLog(level, message) {
  const log = {
    time: new Date().toISOString(),
    level,
    message,
  };
  systemLogs.push(log);
  
  // Keep only last 1000 logs
  if (systemLogs.length > 1000) {
    systemLogs.shift();
  }
  
  // Send to renderer if window exists
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('log:new', log);
  }
  
  console.log(`[${level.toUpperCase()}] ${message}`);
}

// Create status overlay icon (green/red dot)
function createOverlayIcon(color) {
  const { nativeImage } = require('electron');
  const { createCanvas } = require('canvas');
  
  const size = 32;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw circle
  const radius = 12;
  const centerX = size - radius - 2;
  const centerY = size - radius - 2;
  
  // Outer glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Fill circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner highlight
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(centerX - 3, centerY - 3, radius / 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  const buffer = canvas.toBuffer('image/png');
  return nativeImage.createFromBuffer(buffer);
}

// Create tray icon with status indicator
function createTrayIcon(isActive) {
  const { nativeImage } = require('electron');
  const { createCanvas, loadImage } = require('canvas');
  
  const size = 32;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw base icon (S letter)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);
  
  // Draw status dot
  const dotSize = 8;
  const dotX = size - dotSize - 2;
  const dotY = size - dotSize - 2;
  
  // Glow effect
  ctx.shadowColor = isActive ? '#22c55e' : '#ef4444';
  ctx.shadowBlur = 6;
  
  // Draw dot
  ctx.fillStyle = isActive ? '#22c55e' : '#ef4444';
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Dot border
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
  ctx.stroke();
  
  const buffer = canvas.toBuffer('image/png');
  return nativeImage.createFromBuffer(buffer);
}

// Update status indicators
function updateStatusIndicators(isActive) {
  const color = isActive ? '#22c55e' : '#ef4444'; // green : red
  
  // Update taskbar overlay (Windows footer icon)
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (currentOverlayColor !== color) {
      const overlay = createOverlayIcon(color);
      mainWindow.setOverlayIcon(overlay, isActive ? 'DPI Bypass Active' : 'DPI Bypass Inactive');
      currentOverlayColor = color;
    }
  }
  
  // Update system tray icon
  if (tray && !tray.isDestroyed()) {
    const trayIcon = createTrayIcon(isActive);
    tray.setImage(trayIcon);
    tray.setToolTip(`Shroudly - ${isActive ? 'Active' : 'Inactive'}`);
    
    // Update tray menu
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Shroudly',
        click: () => mainWindow.show(),
      },
      { type: 'separator' },
      {
        label: 'Status',
        enabled: false,
      },
      {
        label: isActive ? '🟢 Active' : '🔴 Inactive',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click: () => {
          app.isQuitting = true;
          if (dpiBypass?.isActive) {
            dpiBypass.stop();
          }
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(contextMenu);
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Allow loading local resources
    },
    icon: path.join(__dirname, '../public/icon.ico'),
    title: 'Shroudly - Unseen. Unstoppable.',
    frame: false,
    backgroundColor: '#0A0E1A',
    show: false,
  });

  // Determine which URL to load
  let startUrl;
  const devServerAvailable = await checkDevServer();
  
  if (isDev && devServerAvailable) {
    // Development with Next.js dev server
    startUrl = `http://localhost:${PORT}`;
    console.log('🌐 Mode: Development (with dev server)');
  } else {
    // Production or development without dev server
    const indexPath = path.join(__dirname, '../out/index.html');
    
    // Check if out folder exists
    if (!fs.existsSync(indexPath)) {
      console.error('❌ Build files not found! Run: npm run build');
      addLog('error', 'Build files not found. Please run "npm run build" first.');
      
      // Show error dialog
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'Build Required',
        'Application build files not found.\n\nPlease run: npm run build\n\nOr use: npm run electron:dev for development'
      );
      app.quit();
      return;
    }
    
    // Use file:// protocol with proper path formatting
    startUrl = url.format({
      pathname: indexPath,
      protocol: 'file:',
      slashes: true
    });
    console.log('🌐 Mode: Production (using static files)');
  }

  console.log('🚀 Shroudly starting...');
  console.log('📍 isDev:', isDev);
  console.log('🌐 Loading URL:', startUrl);
  
  addLog('info', 'Shroudly initializing...');
  addLog('info', `Loading from: ${devServerAvailable ? 'Dev Server' : 'Static Files'}`);

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Window ready and shown');
    addLog('success', 'Application started successfully');
    addLog('info', 'DPI Bypass engine ready');
  });

  // Error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', validatedURL);
    console.error('Error code:', errorCode);
    console.error('Error description:', errorDescription);
  });

  mainWindow.on('close', (event) => {
    // Check minimize to tray setting
    const minimizeToTray = store.get('minimizeToTray', true);
    
    if (!app.isQuitting && minimizeToTray) {
      event.preventDefault();
      mainWindow.hide();
      
      // Show notification if enabled
      const showNotifications = store.get('showNotifications', true);
      if (showNotifications) {
        const { Notification } = require('electron');
        if (Notification.isSupported()) {
          new Notification({
            title: 'Shroudly',
            body: 'Application minimized to system tray',
            icon: path.join(__dirname, '../public/icon-small.png')
          }).show();
        }
      }
    }
  });

  // Create tray
  createTray();
  
  // Initialize status indicators as inactive
  updateStatusIndicators(false);
}

function createTray() {
  // Create initial tray icon (inactive state)
  const trayIcon = createTrayIcon(false);
  
  tray = new Tray(trayIcon);
  tray.setToolTip('Shroudly - Inactive');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Shroudly',
      click: () => mainWindow.show(),
    },
    { type: 'separator' },
    {
      label: 'Status',
      enabled: false,
    },
    {
      label: '🔴 Inactive',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.isQuitting = true;
        if (dpiBypass?.isActive) {
          dpiBypass.stop();
        }
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

// Auto-start functionality
function setAutoStart(enable) {
  if (isDev) {
    console.log('[Shroudly] Auto-start not available in development mode');
    return;
  }

  app.setLoginItemSettings({
    openAtLogin: enable,
    openAsHidden: false,
    path: process.execPath,
    args: []
  });
  
  console.log(`[Shroudly] Auto-start ${enable ? 'enabled' : 'disabled'}`);
  addLog('info', `Auto-start ${enable ? 'enabled' : 'disabled'}`);
}

app.whenReady().then(async () => {
  createWindow();
  dpiBypass = new DPIBypass(store);

  // Auto-start DPI bypass if Auto Mode is enabled
  mainWindow.webContents.on('did-finish-load', async () => {
    const autoMode = store.get('autoMode', true);
    if (autoMode) {
      addLog('info', 'Auto Mode enabled - starting DPI bypass automatically');
      
      // Wait a bit for UI to be ready
      setTimeout(async () => {
        try {
          const result = await dpiBypass.start();
          if (result.success) {
            addLog('success', 'DPI bypass started automatically');
            updateStatusIndicators(true);
            
            // Show notification if enabled
            const showNotifications = store.get('showNotifications', true);
            if (showNotifications) {
              const { Notification } = require('electron');
              if (Notification.isSupported()) {
                new Notification({
                  title: 'Shroudly - Auto Mode',
                  body: 'DPI bypass started automatically',
                  icon: path.join(__dirname, '../public/icon.ico')
                }).show();
              }
            }
          } else {
            addLog('error', `Auto-start failed: ${result.error}`);
            updateStatusIndicators(false);
          }
        } catch (error) {
          addLog('error', `Auto-start error: ${error.message}`);
          updateStatusIndicators(false);
        }
      }, 2000); // 2 second delay for UI to load
    }
  });

  // Register F12 to toggle DevTools
  if (isDev) {
    const { globalShortcut } = require('electron');
    globalShortcut.register('F12', () => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools();
      }
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit, just hide to tray
  }
});

app.on('before-quit', () => {
  if (dpiBypass?.isActive) {
    dpiBypass.stop();
  }
});

// IPC Handlers
ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window:close', () => {
  mainWindow.hide();
});

ipcMain.handle('dpi:start', async (event, config) => {
  try {
    addLog('info', 'Starting DPI Bypass...');
    await dpiBypass.start(config);
    updateStatusIndicators(true);
    addLog('success', 'DPI Bypass activated successfully');
    return { success: true };
  } catch (error) {
    addLog('error', `Failed to start DPI Bypass: ${error.message}`);
    
    // Check if it's an admin rights error
    if (error.message.includes('Administrator')) {
      const { dialog } = require('electron');
      const result = await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'Administrator Rights Required',
        message: 'DPI Bypass requires administrator privileges to modify network settings.',
        detail: 'Please restart the application as administrator.',
        buttons: ['Restart as Admin', 'Cancel'],
        defaultId: 0,
        cancelId: 1
      });
      
      if (result.response === 0) {
        // Restart with admin rights
        const { shell } = require('electron');
        shell.openExternal(`powershell -Command "Start-Process '${process.execPath}' -Verb RunAs"`);
        app.quit();
      }
    }
    
    return { success: false, error: error.message };
  }
});

ipcMain.handle('dpi:stop', async () => {
  try {
    addLog('info', 'Stopping DPI Bypass...');
    await dpiBypass.stop();
    updateStatusIndicators(false);
    addLog('success', 'DPI Bypass stopped successfully');
    return { success: true };
  } catch (error) {
    addLog('error', `Failed to stop DPI Bypass: ${error.message}`);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('dpi:status', () => {
  return {
    active: dpiBypass?.isActive || false,
    stats: dpiBypass?.getStats() || {},
  };
});

ipcMain.handle('settings:get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('settings:set', (event, key, value) => {
  store.set(key, value);
  
  // Handle special settings
  if (key === 'autoStart') {
    setAutoStart(value);
  }
  
  return true;
});

ipcMain.handle('settings:getAll', () => {
  return store.store;
});

ipcMain.handle('logs:get', () => {
  return systemLogs;
});

ipcMain.handle('logs:clear', () => {
  systemLogs = [];
  addLog('info', 'Logs cleared');
  return true;
});

function updateTrayStatus(isActive) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Shroudly',
      click: () => mainWindow.show(),
    },
    { type: 'separator' },
    {
      label: 'Status',
      enabled: false,
    },
    {
      label: isActive ? '● Active' : '○ Inactive',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.isQuitting = true;
        if (dpiBypass?.isActive) {
          dpiBypass.stop();
        }
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
