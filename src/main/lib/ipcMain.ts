import { ipcMain, dialog, BrowserWindow, app, nativeTheme } from 'electron'

const setIpc = () => {
  ipcMain.handle('windows-mini', (event, args) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  ipcMain.handle('window-max', async (event, args) => {
    if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
      BrowserWindow.fromWebContents(event.sender)?.restore()
      return { status: false }
    } else {
      BrowserWindow.fromWebContents(event.sender)?.maximize()
      return { status: true }
    }
  })
  ipcMain.handle('window-close', (event, args) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
  ipcMain.handle('app-close', (event, args) => {
    app.quit()
  })
  ipcMain.handle('open-messagebox', async (event, arg) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return
    const res = await dialog.showMessageBox(win, {
      type: arg.type || 'info',
      title: arg.title || '',
      buttons: arg.buttons || [],
      message: arg.message || '',
      noLink: arg.noLink || true
    })
    return res
  })
  ipcMain.handle('open-errorbox', (event, arg) => {
    dialog.showErrorBox(
      arg.title,
      arg.message
    )
  })
  ipcMain.handle('open-win', (event, arg) => {
    let winURL = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined ? import.meta.env.VITE_DEV_SERVER_URL : new URL('./renderer/index.html', 'file://' + __dirname).toString()

    const ChildWin = new BrowserWindow({
      height: 595,
      useContentSize: true,
      width: 842,
      autoHideMenuBar: true,
      minWidth: 842,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        // 如果是开发模式可以使用devTools
        devTools: import.meta.env.DEV,
        // devTools: true,
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      }
    })
    // 开发模式下自动开启devtools
    if (import.meta.env.DEV) {
      ChildWin.webContents.openDevTools({ mode: 'undocked', activate: true })
    }
    ChildWin.loadURL(winURL + `#${arg.url}`)
    ChildWin.webContents.once('dom-ready', () => {
      ChildWin.show()
      if (arg.IsPay) {
        // 检查支付时候自动关闭小窗口
        const testUrl = setInterval(() => {
          const Url = ChildWin.webContents.getURL()
          if (Url.includes(arg.PayUrl)) {
            ChildWin.close()
          }
        }, 1200)
        ChildWin.on('close', () => {
          clearInterval(testUrl)
        })
      }
    })
    // 渲染进程显示时触发
    ChildWin.once("show", () => {
      ChildWin.webContents.send('send-data-test', arg.sendData)
    })
  })
  ipcMain.handle('theme-custom', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })
  ipcMain.handle('theme-system', () => {
    nativeTheme.themeSource = 'system'
  })
}

export default setIpc
