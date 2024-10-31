interface ReturnValue {
  success: boolean
  data?: Record<string, any>
  message: string
  error?: string
}
export interface IElectronAPI {
  // 基础数据操作
  backupLocalStorage: (data: Record<string, any>) => Promise<ReturnValue>
  restoreLocalStorage: () => Promise<ReturnValue>
  // backupPath: string
  getBackupPath: () => Promise<string>
  uploadFile: (file: string) => Promise<ReturnValue>
}
