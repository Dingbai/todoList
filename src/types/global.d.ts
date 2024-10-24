import { type IElectronAPI } from './electron.d'
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
