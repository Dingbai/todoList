export interface IElectronAPI {
  // 基础数据操作
  backupLocalStorage: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>
  restoreLocalStorage: () => Promise<{
    success: boolean
    data?: Record<string, any>
    error?: string
  }>
}
