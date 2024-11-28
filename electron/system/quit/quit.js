import { dialog, app, BrowserWindow } from 'electron'
import { store } from '../../store/index.js'

// todo: 退出应用控制台报异常
function quitApp(tray) {
  // 因为组织了close的默认事件，所以需要手动关闭窗口和清理资源
  try {
    // 关闭所有窗口
    BrowserWindow.getAllWindows().forEach((window) => {
      if (!window.isDestroyed()) {
        window.destroy()
      }
    })
    // 清理托盘
    if (tray) {
      tray.destroy()
    }
    app.quit()
  } catch (e) {
    app.exit(0)
  }
}

async function handleQuit(mainWindow, tray) {
  const preferences = store.get('quitAction')

  if (preferences === 'quit') {
    quitApp(tray)
    return
  }

  if (preferences === 'minimize') {
    mainWindow.hide()
    return
  }

  const { response } = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['退出应用', '最小化到托盘'],
    cancelId: -1,
    title: '退出确认',
    message: '你想要怎么处理应用程序？',
    noLink: true
  })
  switch (response) {
    case 0: // 退出应用
      const { response: quitResponse } = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['记住并退出', '仅此一次'],
        cancelId: -1,
        title: '记住选择',
        message: '是否记住退出选择？',
        noLink: true
      })
      if (quitResponse === -1) return
      if (quitResponse === 0) {
        store.set('quitAction', 'quit')
      }
      quitApp(tray)
      break

    case 1: // 最小化到托盘
      const { response: minimizeResponse } = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['记住并最小化', '仅此一次'],
        cancelId: -1,
        title: '记住选择',
        message: '是否记住最小化选择？',
        noLink: true
      })
      if (minimizeResponse === -1) return
      if (minimizeResponse === 0) {
        store.set('quitAction', 'minimize')
      }
      mainWindow.hide()
      break
  }
}

export default handleQuit
