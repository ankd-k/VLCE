import { Client, Server } from 'node-osc';

class Osc {

  private client: Client | null = null;
  private server: Server | null = null;

  constructor() {
    this.setup();
  }

  public setup = () => {
    // this.createServer();
    // this.createClient();
  }
  public send = (msg: string, ...args: any[]) => {
    if(this.client) {
      this.client.send(msg, ...args);
    }
  }
  public close = () => {
    this.closeServer();
    this.closeClient();
  }


  private createServer = (port: number, host: string) => {
    if(this.server) this.closeServer();

    this.server = new Server(port, host);
  }
  private createClient = (host: string, port: number) => {
    if(this.client) this.closeClient();

    this.client = new Client(host, port);
  }
  private closeServer = () => {
    if(this.server) {
      this.server.close();
      this.server = null;
    } else {
      console.log('server is not exist.');
    }
  }
  private closeClient = () => {
    if(this.client) {
      this.client.close();
      this.client = null;
    } else {
      console.log('server is not exist.');
    }
  }
}

export default Osc;
