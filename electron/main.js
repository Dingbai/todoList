import { app, BrowserWindow, globalShortcut } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import setupDataPersistenceApi from './api/backup/backup.js'
import AutoLaunchManagerApi from './api/autoLaunchManager/autoLaunchManager.js'
import handleQuit from './system/quit/quit.js'
import createTray from './system/tray/tray.js'

// 防止应用退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow
function createWindow() {
  // const splash = new BrowserWindow({
  //   width: 1000,
  //   height: 800,
  //   frame: false, // 去掉窗口边框
  //   transparent: true, // 窗口透明
  //   webContents: {
  //     openDevTools: true
  //   }
  // })
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'api/preload.js')
    },
    webContents: {
      openDevTools: true
    }
  })

  // splash.loadFile(path.join(__dirname, 'splash.html'))
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  createTray(mainWindow)

  mainWindow.once('ready-to-show', () => {
    // 先将主窗口显示在启动窗口下方
    mainWindow.show()
    // splash.focus()
    // 等待淡出动画完成后关闭启动窗口

    // setTimeout(() => {
    //   splash.close()
    //   mainWindow.show()
    // }, 1000)
  })

  // 优化窗口位置
  // const centerWindow = (window) => {
  //   const { width, height } = window.getBounds()
  //   const { width: screenWidth, height: screenHeight } =
  //     require('electron').screen.getPrimaryDisplay().workAreaSize
  //   window.setBounds({
  //     x: Math.floor(screenWidth / 2 - width / 2),
  //     y: Math.floor(screenHeight / 2 - height / 2)
  //   })
  // }

  // centerWindow(splash)
  // centerWindow(mainWindow)
  mainWindow.on('close', (event) => {
    event.preventDefault()
    handleQuit(mainWindow)
  })
}

// ipcMain.on('dom-ready', () => {
//   console.log('dom-ready')
// })
app.whenReady().then(async () => {
  createWindow()
  setupDataPersistenceApi()
  AutoLaunchManagerApi()
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
