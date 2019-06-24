const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // win.setMenu(null);
  win.loadFile('index.html');
  if(process.argv.find((arg)=>arg==='--debug')){
    win.webContents.openDevTools();
  }

  win.on('closed', ()=>{
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', ()=>{
  if(win===null){
    createWindow();
  }
});
