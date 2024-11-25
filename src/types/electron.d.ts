interface ReturnValue {
  success: boolean
  data?: Record<string, any>
  message: string
  error?: string
}
export interface IElectronAPI {
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
  /**
   * 上传文件给 node 解析
   * @param {string} path 本地文件路径
   * @returns
   */
  uploadFile: (file: string) => Promise<ReturnValue & { data: string }>
  /**
   * 设置自动启动
   * @param isAutoLaunch
   * @returns
   */
  toggleAutoLaunch: (state: boolean) => Promise<ReturnValue>
  /**
   * 获取自启动状态
   * @returns {boolean}
   */
  getAutoLaunchState: () => boolean
}
