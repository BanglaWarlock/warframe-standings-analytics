import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

// ── Auto-updater configuration ──────────────────────────────
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('update-available', (info) => {
  // Notify immediately when update is detected, BEFORE downloading
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available — v' + info.version,
    message: `Version ${info.version} is available!`,
    detail: 'Choose how you would like to update:\n\n• Update Now — downloads and installs immediately, app will restart\n• Update on Close — downloads in background, installs when you close the app\n• Skip — do not update this session',
    buttons: ['Update Now', 'Update on Close', 'Skip'],
    defaultId: 0,
    cancelId: 2
  }).then(({ response }) => {
    if (response === 0) {
      // Download then immediately install
      autoUpdater.downloadUpdate()
      autoUpdater.once('update-downloaded', () => {
        autoUpdater.quitAndInstall(true, true)
      })
    } else if (response === 1) {
      // Download silently, install on close
      autoUpdater.autoInstallOnAppQuit = true
      autoUpdater.downloadUpdate()
    }
    // response === 2: do nothing, skip entirely
  })
})

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err.message)
})

// ── IPC handlers ─────────────────────────────────────────────
ipcMain.handle('fetch-item-price', async (_event, itemSlug: string) => {
  const url = `https://api.warframe.market/v2/orders/item/${itemSlug}/top`
  try {
    const response = await axios.get(url)
    return response.data?.data?.buy ?? []
  } catch {
    return []
  }
})

ipcMain.handle('fetch-item-orders', async (_event, itemSlug: string) => {
  const url = `https://api.warframe.market/v2/orders/item/${itemSlug}`
  try {
    const response = await axios.get(url)
    return response.data?.data ?? []
  } catch {
    return []
  }
})

// ── Window ───────────────────────────────────────────────────
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Start checking for updates after window is ready
  // Only check in production, not during development
  if (!is.dev) {
    autoUpdater.checkForUpdates()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})