const {app, BrowserWindow} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin;

function createWindow () {
  let winWidth = 640;//TODO: read from local storage configs
  let winHeight = 360;//TODO: read from local storage configs

  let frameless = true; //TODO: read from local storage configs

  // Create the browser window.
  mainWin = new BrowserWindow({
    width: winWidth, 
    height: winHeight,
    center: true,
    alwaysOnTop: true,
    icon: '/icons/videocam_Edge128.png',
    frame: !frameless
  });

  // and load the app.html of the app.
  mainWin.loadURL(`file://${__dirname}/app.html`);

  // Open the DevTools.
  mainWin.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWin = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWin === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.