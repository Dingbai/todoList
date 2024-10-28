const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  backupLocalStorage: (data) => ipcRenderer.invoke('backup-local-storage', data),
  restoreLocalStorage: () => ipcRenderer.invoke('restore-local-storage'),
  getBackupPath: () => ipcRenderer.invoke('get-backup-path')
})
