const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 备份 localStorage
  backupLocalStorage: (data) => ipcRenderer.invoke('backup-local-storage', data),
  // restoreLocalStorage: (data) => ipcRenderer.invoke('restore-local-storage', data),
  // 获取备份路径
  getBackupPath: () => ipcRenderer.invoke('get-backup-path'),
  // 上传文件给 node 解析
  uploadFile: (path) => ipcRenderer.invoke('upload-file', path)
})

// // 设置一个标志，确保代码只执行一次
// let hasLoadedMainContent = false

// // 监听页面加载完成事件
// window.addEventListener('DOMContentLoaded', () => {
//   if (!hasLoadedMainContent) {
//     setTimeout(() => {
//       ipcRenderer.send('dom-ready') // 主内容加载完毕后切换页面
//       hasLoadedMainContent = true // 标记为已执行
//     }, 200000000) // 模拟开屏动画显示的持续时间
//   }
// })
