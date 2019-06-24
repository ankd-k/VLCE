// electron
const electron = require('electron');
const { app, BrowserWindow } = require('electron');

let win;

// osc
const osc = require('node-osc');
let oscClient = null;
let clientIP = null;
let clientPort = null;
// OSC受信PORT
let oscServer = null;
let serverPort = null;
// ip, port規定値
const defaultIP = '192.168.1.212';
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
  // 初期化処理完了時
  app.on('ready', () => {
    openWindow();
  });

  app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
      console.log('app window-all-closed event');
      closeWindow();
    }
  });

  app.on('activate', ()=>{
    if(win===null){
      openWindow();
    }
  });
  //
  // openWindow();
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
    fullscreen: true,
    frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');

  win.on('closed', ()=>{
    console.log('winon event closed');
    closeWindow();
  });

  if(process.argv.find((arg)=>arg==='--debug')) win.webContents.openDevTools();

  // setup osc
  setupOSC();
}
/*--------------------------------------------------------------------------
	@closeWindow アプリ終了
--------------------------------------------------------------------------*/
function closeWindow() {
  console.log('close window');
  console.log('kill osc');
	if (oscServer) {
    oscServer.close();
    oscServer = null;
  }
	if (oscClient) {
    oscClient.close();
    oscClient = null;
  }

  console.log('clear session');
	electron.session.defaultSession.clearCache(() => { })

  console.log('kill win');
	if (win != null) {
    console.log('close win');
		// win.close();
		win = null;
	}
  console.log('app quit');
	app.quit();
}


/*--------------------------------------------------------------------------
	@setup OSCのセットアップ
--------------------------------------------------------------------------*/
function setupOSC() {
  clientIP = defaultIP;
  clientPort = defaultPort;
  // create
  createServer();
  createClient();
}
/*--------------------------------------------------------------------------
	@createServer OSC受信
--------------------------------------------------------------------------*/
function createServer() {
	oscServer = new osc.Server(serverPort);
	// # OSC受信
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
function createClient() {
	// OSCクライアント（送信先IP, 送信先ポート）
	oscClient = new osc.Client(clientIP, clientPort);
  console.log('oscClient =', oscClient);

	// IPC通信でレンダープロセスから受け取ったメッセージをOSCフォーマットに変換して送信
	electron.ipcMain.on("client", (ipcRenderer, param) => {
    // console.log('ipcMain client, param =', param, ',\n param type=', typeof(param));
		// let args = param.split(" ");
		let sendMsg = new osc.Message('/textaction');
		// // 引数のキャストは、アプリに応じて調整
    param.forEach(value => {
      sendMsg.append(value);
    });

		console.log(oscClient.send(sendMsg));
	});
}
