const { app, ipcMain } = require('electron')
const AutoLaunch = require('auto-launch')

class AutoLaunchManager {
  constructor(options = {}) {
    this.appName = options.appName || app.getName()
    this.isHidden = options.isHidden || false

    // 为 Mac 和 Windows 创建自启动实例
    this.autoLauncher = new AutoLaunch({
      name: this.appName,
      path: app.getPath('exe'),
      isHidden: this.isHidden
    })

    // 缓存当前的自启动状态
    this.isEnabled = false
  }

  // 初始化并检查当前状态
  async init() {
    try {
      this.isEnabled = await this.autoLauncher.isEnabled()
      return this.isEnabled
    } catch (error) {
      console.error('检查自启动状态失败:', error)
      return false
    }
  }

  // 启用自启动
  async enable() {
    try {
      if (!this.isEnabled) {
        await this.autoLauncher.enable()
        this.isEnabled = true
      }
      return true
    } catch (error) {
      console.error('启用自启动失败:', error)
      return false
    }
  }

  // 禁用自启动
  async disable() {
    try {
      if (this.isEnabled) {
        await this.autoLauncher.disable()
        this.isEnabled = false
      }
      return true
    } catch (error) {
      console.error('禁用自启动失败:', error)
      return false
    }
  }

  // 切换自启动状态
  async toggle(state) {
    try {
      console.log('state :>> ', state)
      if (state) {
        await this.enable()
      } else {
        await this.disable()
      }
      return { success: true, message: '切换自启动状态成功' }
    } catch (e) {
      return { success: false, message: e }
    }
  }

  // 获取当前状态
  getState() {
    return this.isEnabled
  }
}

async function AutoLaunchManagerApi() {
  // 创建实例
  const autoLaunch = new AutoLaunchManager({
    appName: 'todoList', // 可选，默认使用 app.getName()
    isHidden: false // 可选，是否隐藏窗口启动
  })

  // 初始化并获取当前状态
  await autoLaunch.init()

  // 在 IPC 中处理开关请求
  ipcMain.handle('toggle-auto-launch', async (_event, state) => {
    console.log('autoLaunch.getState() :>> ', autoLaunch.getState())
    return await autoLaunch.toggle(state)
  })

  // 获取当前状态
  ipcMain.handle('get-auto-launch-state', () => {
    return autoLaunch.getState()
  })
}

module.exports = AutoLaunchManagerApi
