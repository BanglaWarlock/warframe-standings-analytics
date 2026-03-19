import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

// ── Auto-updater configuration ──────────────────────────────
autoUpdater.autoDownload = true        // download silently in background
autoUpdater.autoInstallOnAppQuit = true // install when app quits if user chose Later

autoUpdater.on('update-available', (info) => {
  console.log(`Update available: v${info.version} — downloading in background...`)
})

autoUpdater.on('update-downloaded', (info) => {
  // Update is ready — now notify the user
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: `Version ${info.version} has been downloaded.`,
    detail: 'The update has been downloaded in the background and is ready to install.\n\nYou can install it now (the app will restart) or continue using the app — it will be installed automatically when you next close it.',
    buttons: ['Install Now', 'Later'],
    defaultId: 0,
    cancelId: 1
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.quitAndInstall(false, true)
      // false = don't silent-install, true = restart after install
    }
    // if response === 1 (Later), autoInstallOnAppQuit handles it
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