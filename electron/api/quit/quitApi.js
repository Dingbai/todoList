import { ipcMain } from 'electron'
import { store } from '../../store/index.js'
function handleQuitApi() {
  ipcMain.handle('get-quit-action', () => {
    return store.get('quitAction')
  })
  ipcMain.handle('set-quit-action', (_event, action) => {
    store.set('quitAction', action)
  })
}
export default handleQuitApi
