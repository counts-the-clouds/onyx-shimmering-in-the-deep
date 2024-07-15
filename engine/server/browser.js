global.electron = require('electron');
global.ipcMain = electron.ipcMain;
global.app = electron.app;

global.Browser = (function() {

  let mainWindow;

  function init() {
    app.on('ready', Browser.open);
    app.on('window-all-closed', Browser.quit);
    app.on('activate', Browser.activate);

    // Open new windows in the user's default browser.
    app.on('web-contents-created', (e, contents) => {
      contents.on('new-window', (e, url) => {
        e.preventDefault();
        electron.shell.openExternal(url);
      });
    });
  }

  function open() {
    mainWindow = new electron.BrowserWindow({
      width: 1920,
      height: 1080,
      minWidth: 1280,
      minHeight: 720,
      icon: `${ROOT}/assets/icon.png`,

      webPreferences: {
        preload: `${ROOT}/client/preload.js`
      },
    });

    mainWindow.loadURL(`file://${ROOT}/client/index.html`);

    if (Environment.isDevelopment()) {
      mainWindow.webContents.openDevTools();
    }

    if (Environment.isProduction()) {
      mainWindow.setMenu(null);
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
      quit();
    });
  }

  function activate() {
    if (mainWindow === null) { createWindow(); }
  }

  function quit() {
    app.quit();
  }

  function send(message, content) {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send(message, content);
    }
  }

  return { init, open, quit, activate, send };

})();

// Rather than calling this function directly we pass a message to it. The
// specs don't include the server module so the Browser would be undefined
// there.

Switchboard.onRender(viewState => {
  Browser.send("render", viewState);
});
