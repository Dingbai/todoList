interface ReturnValue {
  success: boolean
  data?: Record<string, any>
  message: string
  error?: string
}
export interface IElectronAPI {
  // 基础数据操作
  /**
   * 备份 localStorage
   * @param data
   * @returns
   */
  backupLocalStorage: (data: string) => Promise<ReturnValue>
  // restoreLocalStorage: () => Promise<ReturnValue>
  // backupPath: string
  /**
   * 获取备份路径
   * @returns {Promise<ReturnValue & { data: string }>}
   */
  getBackupPath: () => Promise<string>
  uploadFile: (file: string) => Promise<ReturnValue & { data: string }>
  /**
   * 设置自动启动
   * @param isAutoLaunch
   * @returns
   */
  setAutoLaunch: (isAutoLaunch: boolean) => ReturnValue
  /**
   * 获取自启动状态
   * @returns {boolean}
   */
  getAutoLaunch: () => boolean
}
