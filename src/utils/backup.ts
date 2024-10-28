export class LocalStorageManager {
  static async backup() {
    const data = localStorage.list
    return await window.electronAPI.backupLocalStorage(data)
  }

  static async restore() {
    const result = await window.electronAPI.restoreLocalStorage()
    if (result.success && result.data) {
      localStorage.list = result.data
    }
    return result
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

export function backupData() {
  document.addEventListener('DOMContentLoaded', async () => {
    // 应用启动时恢复数据
    await LocalStorageManager.restore()

    // 启动自动备份
    LocalStorageManager.startAutoBackup()

    // 在应用关闭前备份数据
    window.addEventListener('beforeunload', async () => {
      await LocalStorageManager.backup()
    })
  })
}
