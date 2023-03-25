const electron = require('electron');
const path = require('path');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: { contextIsolation: false, nodeIntegration: true },
  });

  mainWindow.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});
