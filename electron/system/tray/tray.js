import { Tray, Menu, nativeImage } from 'electron'
import utils from '../../utils/index.js'

let tray = null

function createTray(mainWindow) {
  try {
    const trayIconPath = utils.getPlatformIcon('tray')
    console.log('trayIcon :>> ', trayIconPath)
    const trayIcon = nativeImage.createFromPath(trayIconPath)
    console.log('trayIcon.empty() :>> ', trayIcon.isEmpty())
    const resizedIcon = trayIcon.resize({
      width: 16,
      height: 16,
      quality: 'better'
    })
    tray = new Tray(resizedIcon)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开主应用',
        click: () => mainWindow.show()
      },
      {
        label: '退出应用',
        click: () => {
          app.isQuiting = true
          app.quit()
        }
      }
    ])

    tray.setToolTip('todoList')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => mainWindow.show())
    return tray
  } catch (e) {
    console.log('createTray error :>> ', e)
    return null
  }
}

export default createTray
