import { Tray, Menu } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let tray = null
function createTray(mainWindow) {
  const iconPath = path.join(__dirname, 'icon.png')
  tray = new Tray(iconPath)

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
}

export default createTray