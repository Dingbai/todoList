const { autoUpdater, dialog } = require('electron')
class LocalStorageManager {
  static async backup() {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    return await window.electronAPI.backupLocalStorage(data)
  }

  static async restore() {
    const result = await window.electronAPI.restoreLocalStorage()
    if (result.success && result.data) {
      Object.entries(result.data).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
      return true
    }
    return false
  }

  // 定期自动备份
  static startAutoBackup(intervalMinutes = 5) {
    setInterval(
      () => {
        this.backup().catch(console.error)
      },
      intervalMinutes * 60 * 1000
    )
  }
}

// 使用示例
document.addEventListener('DOMContentLoaded', async () => {
  // 应用启动时恢复数据
  await LocalStorageManager.restore()

  // 启动自动备份
  LocalStorageManager.startAutoBackup()

  // 在应用关闭前备份数据
  window.addEventListener('beforeunload', async (e) => {
    await LocalStorageManager.backup()
  })
})

// 更新处理
// 在你的自动更新代码中添加：
autoUpdater.on('update-downloaded', async (info) => {
  // 在安装更新前备份数据
  await LocalStorageManager.backup()

  // 显示更新确认对话框
  dialog
    .showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '更新已下载，重启应用以安装更新。',
      buttons: ['立即重启', '稍后重启']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
})
