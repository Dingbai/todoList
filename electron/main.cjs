const { app, BrowserWindow, globalShortcut } = require('electron')
const setupDataPersistence = require('./backup/backup.cjs')
const path = require('path')

// let tray = null

// // 用于存储配置的路径
// const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json')

// async function createTray() {
//   // 创建托盘图标
//   tray = new Tray(path.join(__dirname, 'icon.png'))

//   // 创建托盘菜单
//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: '数据恢复',
//       click: async () => {
//         try {
//           const { filePaths } = await dialog.showOpenDialog({
//             properties: ['openFile'],
//             filters: [{ name: '配置文件', extensions: ['json'] }]
//           })

//           if (filePaths.length > 0) {
//             const importedConfig = await fs.readFile(filePaths[0], 'utf8')
//             await fs.writeFile(CONFIG_PATH, importedConfig)
//             dialog.showMessageBox({
//               type: 'info',
//               message: '配置导入成功！'
//             })
//           }
//         } catch (error) {
//           dialog.showErrorBox('错误', '导入配置失败：' + error.message)
//         }
//       }
//     },
//     {
//       label: '数据备份',
//       click: async () => {
//         try {
//           const { filePath } = await dialog.showSaveDialog({
//             defaultPath: path.join(app.getPath('downloads'), 'config.json'),
//             filters: [{ name: '配置文件', extensions: ['json'] }]
//           })

//           if (filePath) {
//             const currentConfig = await fs.readFile(CONFIG_PATH)
//             await fs.writeFile(filePath, currentConfig)
//             dialog.showMessageBox({
//               type: 'info',
//               message: '配置导出成功！'
//             })
//           }
//         } catch (error) {
//           dialog.showErrorBox('错误', '导出配置失败：' + error.message)
//         }
//       }
//     },
//     { type: 'separator' },
//     {
//       label: '退出',
//       click: () => app.quit()
//     }
//   ])

//   tray.setToolTip('应用配置')
//   tray.setContextMenu(contextMenu)
// }

// // 确保配置文件存在
// async function ensureConfigExists() {
//   try {
//     await fs.access(CONFIG_PATH)
//   } catch {
//     // 配置文件不存在，创建默认配置
//     const defaultConfig = {
//       // 在这里定义你的默认配置
//       theme: 'light',
//       language: 'zh-CN'
//       // ... 其他配置项
//     }
//     await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2))
//   }
// }

// 防止应用退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    webContents: {
      openDevTools: true
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async () => {
  createWindow()
  setupDataPersistence()
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
