import { app, shell, Tray, Menu, nativeImage, clipboard, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

// 模拟 __dirname 和 __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();
const NODE_ENV = process.env.NODE_ENV;

// 全局作用域
let tray;
let mainWindow;

// 创建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    resizable: false,
    frame: false, // 窗口框架
    transparent: true, // 窗口背景透明
    webPreferences: {
      webSecurity: false, // 关闭网站安全检查
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // IPC 主进程事件
  ipcMain.on('closeFrame', () => {
    console.log("关闭应用");
    app.quit();
  });

  ipcMain.on('minimizeToTray', () => {
    console.log("最小化到托盘");
    mainWindow.hide();
  });

  ipcMain.on('minimizeFrame', () => {
    mainWindow.minimize();
  });

  // 获取存储内容
  ipcMain.handle('get-store', async (event, key) => {
    try {
      const value = store.get(key, false); // 添加默认值 false
      if (value === undefined) {
        console.warn(`Key "${key}" not found in store. Returning default value.`);
      }
      return value;
    } catch (error) {
      console.error(`Error in get-store: ${error.message}`);
      return false; // 出现错误时返回默认值 false
    }
  });


  // 设置存储内容
  ipcMain.handle('set-store', async (event, key, value) => {
    try {
      console.log(`Setting ${key} to ${value}`);
      store.set(key, value);
      return true; // 成功
    } catch (error) {
      console.error(`Error in set-store: ${error.message}`);
      return false; // 存储失败
    }
  });


  // 删除存储内容
  ipcMain.handle('delete-store', async (event, key) => {
    try {
      const success = store.delete(key);
      if (success) {
        console.log(`Deleted key: ${key}`);
        return true; // 删除成功
      } else {
        console.warn(`Key "${key}" not found to delete.`);
        return false; // 删除失败
      }
    } catch (error) {
      console.error(`Error in delete-store: ${error.message}`);
      return false; // 删除失败
    }
  });

  // 加载 URL
  mainWindow.loadURL(
    NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // 打开开发工具（仅限开发环境）
  if (NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.setBackgroundMaterial('acrylic');
  mainWindow.show();
}

app.whenReady().then(() => {
  // 托盘图标路径
  const imgPath =
    NODE_ENV === 'development'
      ? './src/assets/icon/icon.png'
      : path.join(process.resourcesPath, 'icon.png');

  tray = new Tray(imgPath);

  createWindow();

  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主页面',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: '隐藏主页面',
      click: () => {
        mainWindow.hide();
      },
    },
    { type: 'separator' },
    {
      label: '打开图片',
      click: () => {
        dialog
          .showOpenDialog({
            properties: ['openFile'],
          })
          .then((data) => {
            const filePath = data.filePaths.toString();
            mainWindow.webContents.send('openPicture', filePath);
          });
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        mainWindow.close();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip('Pic To Base64');
  tray.setTitle('Pic To Base64');

  // 双击托盘图标打开应用
  tray.on('click', () => {
    mainWindow.setBackgroundMaterial('acrylic');
    mainWindow.show();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用（除 macOS）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
