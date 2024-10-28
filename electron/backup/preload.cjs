const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  backupLocalStorage: (data) => ipcRenderer.invoke('backup-local-storage', data),
  restoreLocalStorage: () => ipcRenderer.invoke('restore-local-storage'),
  // backupPath: () => ipcRenderer.on('get-backup-path', path)
  // 从主进程接收一次性消息
  receiveOnce: (channel, callback) => {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args))
  },
  getBackupPath: (callback) => {
    ipcRenderer.once('backup-path', (address) => callback(address))
  }
})
