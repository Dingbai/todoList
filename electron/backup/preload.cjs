const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  backupLocalStorage: (data) => ipcRenderer.invoke('backup-local-storage', data),
  // restoreLocalStorage: (data) => ipcRenderer.invoke('restore-local-storage', data),
  getBackupPath: () => ipcRenderer.invoke('get-backup-path'),
  uploadFile: (path) => ipcRenderer.invoke('upload-file', path)
})
