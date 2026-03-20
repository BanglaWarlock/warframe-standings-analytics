import { app, shell, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

// ── Auto-updater configuration ──────────────────────────────
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available — v' + info.version,
    message: `Version ${info.version} is available!`,
    detail: 'Choose how you would like to update:\n\n• Update Now — downloads and installs, app will restart\n• Install on Close — downloads in background, installs when you close the app\n• Skip — do not update this session',
    buttons: ['Update Now', 'Install on Close', 'Skip'],
    defaultId: 0,
    cancelId: 2
  }).then(({ response }) => {
    if (response === 0) {
      // Update Now — download then install
      new Notification({
        title: 'Downloading Update',
        body: `Downloading v${info.version} in the background...`
      }).show()

      autoUpdater.downloadUpdate()

      autoUpdater.once('update-downloaded', (downloadedInfo) => {
        new Notification({
          title: 'Installing Update',
          body: `Installing v${downloadedInfo.version}... The app will restart shortly.`
        }).show()

        // Small delay so user sees the notification before restart
        setTimeout(() => {
          autoUpdater.quitAndInstall(true, true)
        }, 3000)
      })

    } else if (response === 1) {
      // Install on Close
      new Notification({
        title: 'Update Scheduled',
        body: `v${info.version} will be downloaded and installed when you close the app.`
      }).show()

      autoUpdater.downloadUpdate()

      autoUpdater.once('update-downloaded', (downloadedInfo) => {
        new Notification({
          title: 'Update Ready',
          body: `v${downloadedInfo.version} has been downloaded and will install when you close the app.`
        }).show()

        autoUpdater.autoInstallOnAppQuit = true
      })

      app.once('before-quit', () => {
        new Notification({
          title: 'Update Installing',
          body: 'Update is being installed. The new version will be ready next time you open the app.'
        }).show()
      })
    }
    
    // response === 2: Skip, do nothing
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