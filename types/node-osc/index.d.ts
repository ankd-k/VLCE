import { Socket } from 'dgram';

// Message
interface Arguments {
  type: string;
  value: any;
}
export interface Message {
  oscType: string;
  address: string;
  args: Array<any>;

  append(arg: any): void;
}

// Server
declare class Server {
  port: number;
  host: string;
  _sock: Socket;
  kill: Function;

  constructor(port: number, host: string);

  close(cb?: Function): void;
}

// Client
declare class Client {
  host: string;
  port: number;
  _sock: Socket;
  kill: Function;

  constructor(host: string, port: number);

  close(cb?: Function): void;
  send(message: string, ...args: any[]): void;
}
