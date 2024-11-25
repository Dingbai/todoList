const { app, ipcMain } = require('electron')

function handleSystem() {
  ipcMain.handle('set-auto-launch', async (_event, flag) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: flag,
        path: app.getPath('exe'),
        args: ['--hidden'], // 启动参数
        enabled: true
      })
      return { success: true, message: `设置开机自启动成功` }
    } catch (e) {
      console.log('e :>> ', e)
      return { success: false, message: `设置开机自启动失败,${e}` }
    }
  })

  ipcMain.handle('get-auto-launch', async () => {
    return app.getLoginItemSettings().openAtLogin
  })
}

module.exports = handleSystem
