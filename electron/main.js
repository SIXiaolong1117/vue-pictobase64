const { BrowserWindow } = require("electron-acrylic-window");
const { app, shell } = require('electron');
const os = require('os');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV

function isVibrancySupported() {
  // Windows 10 or greater
  return (
    process.platform === 'win32' &&
    parseInt(os.release().split('.')[0]) >= 10
  )
}

let mainWindow
function createWindow() {
  let vibrancy = 'dark'

  if (isVibrancySupported()) {
    console.log('Vibrancy Supported')
    vibrancy = {
      // theme: '#FFFFFF00',
      effect: 'acrylic',
      useCustomWindowRefreshMethod: true,
      disableOnBlur: true,
      debug: false,
    }
  }

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 550,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    
    vibrancy: vibrancy,
  })

  // 加载 index.html
  // mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
  mainWindow.loadURL(
    NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // 打开开发工具
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.show()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  // 隐藏菜单栏
  const { Menu } = require('electron');
  Menu.setApplicationMenu(null);

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。