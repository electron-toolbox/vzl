const { app } = require('electron');
const setupIpcListeners = require('./setup/ipcListeners');
const setupWindow = require('./setup/window');
const setupMenu = require('./setup/menu');

// state lol!
const appState = {
  svg: null, // the currently rendered svg
  mainWindow: null, // the main window instance
  currentSource: null, // the currently opened file source
  currentFile: null, // the currently opened file

  // can't send Sets through IPC
  openedFiles: [], // list of opened files (dict: { file, source })
};

function createWindow() {
  setupIpcListeners(app, appState);
  setupWindow(app, appState);
  setupMenu(app, appState);

  appState.mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (appState.mainWindow === null) {
    createWindow();
  }
});
