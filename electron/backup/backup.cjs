const { app, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs').promises

// 获取用户数据目录
const USER_DATA_PATH = app.getPath('userData')
const BACKUP_FILE = path.join(USER_DATA_PATH, 'localStorage-backup.json')

// 在主进程中设置数据备份和恢复的handlers
function setupDataPersistence() {
  // 处理数据备份请求
  ipcMain.handle('backup-local-storage', async (_event, data) => {
    try {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(data))
      console.log('备份成功')
      return { success: true }
    } catch (error) {
      console.error('备份失败:', error)
      return { success: false, error: error.message }
    }
  })

  // 处理数据恢复请求
  ipcMain.handle('restore-local-storage', async () => {
    try {
      const data = await fs.readFile(BACKUP_FILE, 'utf8')
      console.log('恢复成功')
      return { success: true, data: JSON.parse(data) }
    } catch (error) {
      console.error('恢复失败:', error)
      return { success: false, error: error.message }
    }
  })
}

module.exports = setupDataPersistence
