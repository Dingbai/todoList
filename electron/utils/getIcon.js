import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsPath = path.join(__dirname, '..', 'assets')

const platformIcons = {
  darwin: {
    app: path.join(assetsPath, 'icons', 'macos', 'app-icon.png'),
    tray: path.join(assetsPath, 'icons', 'macos', 'tray-icon.png')
  },
  win32: {
    app: path.join(assetsPath, 'icons', 'windows', 'app-icon.png'),
    tray: path.join(assetsPath, 'icons', 'windows', 'tray-icon.png')
  }
}

export function getPlatformIcon(type) {
  const platform = os.platform()
  const platformIconMap = {
    darwin: platformIcons.darwin,
    win32: platformIcons.win32
  }

  const icons = platformIconMap[platform]
  return icons[type]
}
