import require$$0 from "electron";
import require$$1 from "path";
import require$$2 from "fs";
var main = {};
const { app: app$1, ipcMain } = require$$0;
const path$1 = require$$1;
const fs = require$$2.promises;
const USER_DATA_PATH = app$1.getPath("userData");
const BACKUP_FILE = path$1.join(USER_DATA_PATH, "localStorage-backup.json");
function setupDataPersistence$1() {
  ipcMain.handle("backup-local-storage", async (_event, data) => {
    try {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(data));
      console.log("备份成功");
      return { success: true };
    } catch (error) {
      console.error("备份失败:", error);
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("restore-local-storage", async () => {
    try {
      const data = await fs.readFile(BACKUP_FILE, "utf8");
      console.log("恢复成功");
      return { success: true, data: JSON.parse(data) };
    } catch (error) {
      console.error("恢复失败:", error);
      return { success: false, error: error.message };
    }
  });
}
var backup = setupDataPersistence$1;
const { app, BrowserWindow, globalShortcut } = require$$0;
const setupDataPersistence = backup;
const path = require$$1;
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.cjs")
    },
    webContents: {
      openDevTools: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
app.whenReady().then(async () => {
  createWindow();
  setupDataPersistence();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
export {
  main as default
};
