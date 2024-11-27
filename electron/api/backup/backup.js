import { app, ipcMain } from 'electron'
import path from 'path'
import { promises as fs } from 'fs'

// 获取用户数据目录
const USER_DATA_PATH = app.getPath('userData')
const BACKUP_FILE = path.join(USER_DATA_PATH, 'localStorage-backup.json')

// 在主进程中设置数据备份和恢复的handlers
function setupDataPersistenceApi() {
  // 处理数据备份请求
  ipcMain.handle('backup-local-storage', async (_event, data) => {
    try {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(data))
      console.log('备份成功')
      return { success: true, message: '数据备份成功' }
    } catch (error) {
      console.error('备份失败:', error)
      return { success: false, message: `数据备份失败,${error.message}` }
    }
  })

  // 获取备份路径
  ipcMain.handle('get-backup-path', async () => {
    return BACKUP_FILE
  })
  // 处理文件上传请求
  ipcMain.handle('upload-file', async (_event, path) => {
    try {
      const fileContent = await fs.readFile(path, 'utf8')

      const jsonData = JSON.parse(fileContent)

      return {
        success: true,
        data: jsonData,
        message: 'File uploaded successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to upload file: ${error.message}`
      }
    }
  })
}

// module.exports = setupDataPersistenceApi
export default setupDataPersistenceApi
