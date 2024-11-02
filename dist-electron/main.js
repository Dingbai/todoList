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
      return { success: false, message: `数据备份失败,${error.message}` };
    }
  });
  ipcMain.handle("get-backup-path", async () => {
    return BACKUP_FILE;
  });
  ipcMain.handle("upload-file", async (_event, path2) => {
    try {
      const fileContent = await fs.readFile(path2, "utf8");
      const jsonData = JSON.parse(fileContent);
      return {
        success: true,
        data: jsonData,
        message: "File uploaded successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to upload file: ${error.message}`
      };
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
    width: 1e3,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "backup/preload.cjs")
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
