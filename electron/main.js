import { app, BrowserWindow, globalShortcut, screen } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import setupDataPersistenceApi from './api/backup/backup.js'
import AutoLaunchManagerApi from './api/autoLaunchManager/autoLaunchManager.js'
import handleQuitApi from './api/quit/quitApi.js'
import handleQuit from './system/quit/quit.js'
import createTray from './system/tray/tray.js'
import utils from './utils/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 在主进程中实现动画帧
function createAnimationFrame() {
  return (callback) => {
    setTimeout(() => {
      callback(Date.now())
    }, 1000 / 60) // 60fps
  }
}

// 使用自定义的 requestAnimationFrame
const requestAnimationFrame = createAnimationFrame()

let mainWindow
function createWindow() {
  const iconPath = utils.getPlatformIcon('app')
  const splash = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: iconPath,
    frame: false, // 去掉窗口边框
    transparent: true, // 窗口透明
    webContents: {
      openDevTools: true
    }
  })
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'api/preload.cjs')
    },
    webContents: {
      openDevTools: true
    }
  })

  splash.loadFile(path.join(__dirname, 'splash.html'))
  splash.show()
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  const tray = createTray(mainWindow)

  mainWindow.once('ready-to-show', () => {
    // 先将主窗口显示在启动窗口下方

    splash.setOpacity(1)
    mainWindow.setOpacity(0)

    // Easing function for smoother transition
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    // Animate splash fade out
    let startTime = null
    const duration = 1000 // ms

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Apply easing
      const opacity = 1 - easeInOut(progress)
      splash.setOpacity(opacity)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        splash.close()
        // Start main window fade in
        startTime = null
        animateMainWindow(currentTime)
      }
    }

    const animateMainWindow = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Apply easing
      const opacity = easeInOut(progress)
      mainWindow.setOpacity(opacity)
      mainWindow.show()

      if (progress < 1) {
        requestAnimationFrame(animateMainWindow)
      }
    }

    requestAnimationFrame(animate)
  })

  // 优化窗口位置
  const centerWindow = (window) => {
    const { width, height } = window.getBounds()
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
    window.setBounds({
      x: Math.floor(screenWidth / 2 - width / 2),
      y: Math.floor(screenHeight / 2 - height / 2)
    })
  }

  centerWindow(splash)
  centerWindow(mainWindow)
  mainWindow.on('close', (event) => {
    event.preventDefault()
    handleQuit(mainWindow, tray)
  })
}

// ipcMain.on('dom-ready', () => {
//   console.log('dom-ready')
// })
app.whenReady().then(async () => {
  createWindow()
  setupDataPersistenceApi()
  AutoLaunchManagerApi()
  handleQuitApi()
  // await ensureConfigExists()
  // createTray()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    BrowserWindow.getFocusedWindow().webContents.toggleDevTools()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
