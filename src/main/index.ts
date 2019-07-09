import { app, App, BrowserWindow } from 'electron';

class Main {
  private mainWindow: BrowserWindow | null = null;
  private app: App;
  private mainURL: string = `file://${__dirname}/index.html`;

  constructor(app: App) {
    this.app = app;
    this.app.on('window-all-closed', this.onWindowAllClosed);
    this.app.on('ready', this.onReady);
    this.app.on('activate', this.onActivate);
  }

  private onWindowAllClosed = () => {
    this.app.quit();
  }

  private create = () => {
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      // fullscreen: true,
      // frame: false,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    this.mainWindow.loadURL(this.mainURL);
    this.mainWindow.on('closed', this.onClosed);
  }

  private onReady = () => {
    this.create();
  }

  private onActivate = () => {
    if (this.mainWindow === null) {
      this.create();
    }
  }

  private onClosed = () => {
    this.mainWindow = null;
  }
}

const main: Main = new Main(app);
