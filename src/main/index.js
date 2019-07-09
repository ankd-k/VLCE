// electron
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

// osc
const osc = require('node-osc');
let oscClient = null;
let clientIP = null;
let clientPort = null;
let oscServer = null;
let serverIP = null;
let serverPort = null;
const defaultIP = '127.0.0.1';
const defaultPort = '9000';

load();


/*--------------------------------------------------------------------------
	@load 初期化処理
--------------------------------------------------------------------------*/
function load() {
  setup();
}
/*--------------------------------------------------------------------------
	@setup アプリのセットアップ
--------------------------------------------------------------------------*/
function setup() {
  console.log('start setup');
  console.log('current directory is ', __dirname);
  // 初期化処理完了時
  app.on('ready', () => {
    openWindow();
  });

  app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
      console.log('app window-all-closed event');
      closeWindow();
    }
  });

  app.on('activate', () => {
    if(win === null){
      openWindow();
    }
  });

  console.log('setup done');
}
/*--------------------------------------------------------------------------
	@openWindow 起動
--------------------------------------------------------------------------*/
function openWindow() {
  console.log('open window');

  if(win != null) closeWindow();

  win = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    // frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // console.log('path :', `${__dirname}dist/renderer/index.html`);
  // win.loadFile(`${__dirname}dist/renderer/index.html`);
  win.loadURL(`file://${__dirname}/renderer/main.html`);

  win.on('closed', () => {
    closeWindow();
  });

  if(process.argv.find((arg) => arg === '--debug')) win.webContents.openDevTools();

  // setup osc
  setupOSC();
}
/*--------------------------------------------------------------------------
	@closeWindow アプリ終了
--------------------------------------------------------------------------*/
function closeWindow() {
  console.log('close window');
  closeOSC();

	electron.session.defaultSession.clearCache(() => { })

	if (win != null) {
		// win.close();
		win = null;
	}
	app.quit();
}


/*--------------------------------------------------------------------------
	@setupOSC OSCのセットアップ
--------------------------------------------------------------------------*/
function setupOSC() {
  console.log('setupOSC()')
  createServer('0.0.0.0', defaultPort);
  createClient(defaultIP, defaultPort+1);
}
/*--------------------------------------------------------------------------
	@setup OSCのセットアップ
--------------------------------------------------------------------------*/
function closeOSC() {
  console.log('closeOSC()');
	if (oscServer) {
    oscServer.close();
    oscServer = null;
  }
	if (oscClient) {
    oscClient.close();
    oscClient = null;
  }
}
/*--------------------------------------------------------------------------
	@createServer OSC受信
--------------------------------------------------------------------------*/
function createServer(ip, port) {
  console.log('createServer(), IP=', ip, ', Port=', port);
  serverIP = ip;
  serverPort = port;
	oscServer = new osc.Server(serverPort, serverIP);

	// レンダープロセスからIPC通信を受け取る
	electron.ipcMain.on("renderer", (ipcRenderer, param) => {
		// IPC通信疎通確認
		ipcRenderer.sender.send("server", "========== Settings ==========");
		ipcRenderer.sender.send("server", "SettingFilePath: " + electron.app.getAppPath("Resources") + "/settings.xml");
		ipcRenderer.sender.send("server", "clientIP: " + clientIP);
		ipcRenderer.sender.send("server", "clientPort: " + clientPort);
		ipcRenderer.sender.send("server", "serverPort: " + serverPort);
		ipcRenderer.sender.send("server", "===========================");
		// OSC通信で受け取ったメッセージをIPC通信でレンダープロセスに送る
		oscServer.on("message", (msg, rinfo) => {
			ipcRenderer.sender.send("server", msg);
		});
	});
}
/*--------------------------------------------------------------------------
	@createClient OSC送信
--------------------------------------------------------------------------*/
function createClient(ip, port) {
  console.log('createClient(), IP=', ip, ', Port=', port);
  clientIP = ip;
  clientPort = port;
	oscClient = new osc.Client(clientIP, clientPort);

	// IPC通信でレンダープロセスから受け取ったメッセージをOSCフォーマットに変換して送信
	electron.ipcMain.on("client", (ipcRenderer, param) => {
		let sendMsg = new osc.Message('/text');
    param.forEach(value => {
      sendMsg.append(value);
    });
		oscClient.send(sendMsg);
	});
}
