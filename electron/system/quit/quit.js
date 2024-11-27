import Store from 'electron-store'
import { dialog, app } from 'electron'

async function handleQuit(mainWindow) {
  const store = new Store({
    name: 'app-preferences',
    defaults: {
      rememberChoice: false,
      quitAction: 'ask'
    }
  })

  const preferences = store.get('quitAction')

  if (preferences === 'quit') {
    app.quit()
    return
  }

  if (preferences === 'minimize') {
    mainWindow.hide()
    return
  }

  const { response } = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['退出应用', '最小化到托盘', '取消'],
    defaultId: 2,
    cancelId: 2,
    title: '退出确认',
    message: '你想要怎么处理应用程序？',
    checkboxLabel: '记住我的选择',
    checkboxChecked: false,
    noLink: true
  })

  switch (response) {
    case 0: // 退出应用
      const { response: quitResponse } = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['记住并退出', '仅此一次', '取消'],
        defaultId: 0,
        cancelId: 2,
        title: '记住选择',
        message: '是否记住退出选择？',
        noLink: true
      })

      if (quitResponse === 0) {
        store.set('quitAction', 'quit')
      }
      app.isQuiting = true
      app.quit()
      break

    case 1: // 最小化到托盘
      const { response: minimizeResponse } = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['记住并最小化', '仅此一次', '取消'],
        defaultId: 0,
        cancelId: 2,
        title: '记住选择',
        message: '是否记住最小化选择？',
        noLink: true
      })

      if (minimizeResponse === 0) {
        store.set('quitAction', 'minimize')
      }
      mainWindow.hide()
      break
  }
}

export default handleQuit
