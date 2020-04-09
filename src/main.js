// npm install -g electron-forge
// electron-forge init SmartyPants-electron-react-app --template=react

//import { app, BrowserWindow, Menu } from "electron";

// Import electron differently because we need eelctron to be loaded before calling screen.
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;


import installExtension, {
  REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Adding a context menu, contains copy command
let context_copy_menu = Menu.buildFromTemplate([ //-----------------------------------------------------------------------------------------------------------------
  { role: 'copy' },
  { role: 'paste' }
]);

// We first identify the execution environment, this way will be able to enable or disable features depending it is PROD or Dev
const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

const createWindow = async () => {

  // We identify our main display which is the chosen to render our app.
  const primaryDisplay = electron.screen.getPrimaryDisplay();  

  // Create the browser window.
  mainWindow = new BrowserWindow({
    //x: primaryDisplay.size.width - 1210,    
    //y: primaryDisplay.size.height - 970,
    // minWidth: 960,
    // minHeight: 650,
    //height: primaryDisplay.size.height - 50,
    x: primaryDisplay.size.width - 1170,
    y: 20,    
    width: 1010,
    height: 700,
    minWidth: 1010,
    minHeight: 700,    
    resizable: true,
    frame: false,
    show: false,
    backgroundColor: "black",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Loading the index.html of the app with the deprecated method.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Using the recommended method instead:
  mainWindow.loadFile(__dirname + "/index.html");

  // Open the DevTools if it is in dev-mode
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  } else {
    // I am enabling dev-mode even if the application is running on Prod-Mode
    // /*
    //await installExtension(REACT_DEVELOPER_TOOLS); // Not sure what is this but if I leave if for production, the app never starts.
    /**/    mainWindow.webContents.openDevTools();
    // */
  }

  // Showing the web content until is ready to display
  mainWindow.once("ready-to-show", mainWindow.show);

  // Adding the contextMenu //-----------------------------------------------------------------------------------------------------------------
  mainWindow.webContents.on('context-menu', (e) => {
    context_copy_menu.popup();
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.





/* CODE FOR THE LOCALHOST THAT WILL SERVE UP FILES*/

const path = require('path');
const express = require('express');

const server = express();
const publicDirPath = path.join(__dirname, '/public');

server.use(express.static(publicDirPath));

server.get('/', (req, res) => {
  res.send("Ya mero")
})

server.listen(8000, () => {
  console.log('Up running on 8000');
})