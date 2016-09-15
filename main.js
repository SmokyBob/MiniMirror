const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWin;
let optWindow;
let frameless = true;

function createMainWindow () {
  let winWidth = 640;//TODO: read from local storage configs
  let winHeight = 480;//TODO: read from local storage configs

  //frameless = true; //TODO: read from local storage configs

  // Create the browser window.
  mainWin = new BrowserWindow({
    width: winWidth, 
    height: winHeight,
    center: true,
    alwaysOnTop: true,
    useContentSize: true,
    icon: `/icons/videocam_Edge128.png`,
    frame: !frameless,
    transparent: true
  });

  // and load the app.html of the app.
  mainWin.loadURL(`file://${__dirname}/app.html`);

}

function createOptionWindow() {
  optWindow = new BrowserWindow({
    frame: true,
    parent: mainWin,
    titleBarStyle: 'hidden'
  });

  //Load the option window
  optWindow.loadURL(`file://${__dirname}/options.html`);

  optWindow.show();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

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
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//render process to main process comunnication
ipcMain.on('async-ops', (event, arg) => {
  
  switch (arg.command) {
    case "openOptions":
      createOptionWindow();
      break;
    case "adaptSize":
      //Set Main Window sizes
      mainWin.setSize(mainWin.getSize()[0], arg.height,true);
      
      break;
    case "changeFrame":
      //Change the frame and reopen the main window
      frameless = !frameless;
      let oldWindow = mainWin;
      createMainWindow();
      oldWindow.close();
      break;
    case "fullClose":
      //Close all the windows and quit the app
      if (mainWin)
        mainWin.close();

      if (optWindow)
        optWindow.close();

      break;
    default:
      console.log("Sorry, command not valid " + arg + ".");
  }
  
});