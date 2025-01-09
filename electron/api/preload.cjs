const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 备份 localStorage
   * @param {Data} data
   * @returns
   */
  backupLocalStorage: (data) => ipcRenderer.invoke('backup-local-storage', data),
  // restoreLocalStorage: (data) => ipcRenderer.invoke('restore-local-storage', data),
  /**
   * 获取备份路径
   * @returns {Promise<string>} 备份路径
   */
  getBackupPath: () => ipcRenderer.invoke('get-backup-path'),
  /**
   * 上传文件给 node 解析
   * @param {string} path 本地文件路径
   * @returns
   */
  uploadFile: (path) => ipcRenderer.invoke('upload-file', path),
  /**
   * 切换自启动状态
   * @returns {Promise<ReturnValue>} 是否自启动
   */
  toggleAutoLaunch: (state) => ipcRenderer.invoke('toggle-auto-launch', state),
  /**
   * 获取自启动状态
   * @returns {Promise<boolean>} 是否自启动
   */
  getAutoLaunchState: () => ipcRenderer.invoke('get-auto-launch-state'),
  /**
   * 获取退出状态
   * @returns {Promise<string>} 退出行为
   */
  getQuitAction: () => ipcRenderer.invoke('get-quit-action'),
  /**
   * 设置退出状态
   * @param {*} action
   * @returns
   */
  setQuitAction: (action) => ipcRenderer.invoke('set-quit-action', action)
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
