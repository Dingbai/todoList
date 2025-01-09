import Store from 'electron-store'
export const store = new Store({
  name: 'app-preferences',
  defaults: {
    quitAction: 'ask' // ask, quit, minimize
  }
})
