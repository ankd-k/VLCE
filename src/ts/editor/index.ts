import ace from 'ace-builds';
import * as fs from 'fs-extra';
// const fs = require('fs');

import 'ace-builds/src-noconflict/mode-glsl';
import 'ace-builds/src-noconflict/theme-origin';
import 'ace-builds/src-noconflict/theme-monokai';


export default class TextEditor {
  private _editor: ace.Ace.Editor;
  private _element: HTMLElement;
  private _currentPath: string;

  constructor(el: string | HTMLElement) {
    let element = (typeof(el)=='string') ? document.getElementById(el) : el;
    if(!element) {
      console.error('element is not exist.', element);
      element = document.createElement('div');
      document.appendChild(element);
    }
    this._element = element;
    this._editor = ace.edit(this._element);
    this._currentPath = '';

    this.fontSize = 18;
    this.mode = 'ace/mode/glsl';
    this.theme = 'ace/theme/origin';
    this.tabSize = 2;
    this._editor.setOption('showPrintMargin', false);
    this._editor.focus();
  }

  // getter
  get editor(): ace.Ace.Editor { return this._editor;}
  get value(): string { return this._editor.getValue(); }
  get line(): string { return this._editor.getSession().getLine(this._editor.getCursorPosition().row); }
  get cursor(): {row: number, column: number} { return this._editor.getSelection().getCursor(); }
  public getLines = (start: number, end?: number) => {
    if(!end) return this._editor.getSession().getLine(start);
    else return this._editor.getSession().getLines(start, end);
  }
  get opacity(): number { return this._element.style.opacity ? parseFloat(this._element.style.opacity) : -1; }

  // setter
  set value(value: string) { this._editor.setValue(value); }
  set fontSize(fontSize: number | string) { this._editor.setFontSize( ((typeof fontSize === 'number') ? fontSize.toString() : fontSize) + 'px' ); }
  set mode(mode: string) { this._editor.getSession().setMode(mode); }
  set theme(theme: string) { this._editor.setTheme(theme); }
  set tabSize(tabSize: number) { this._editor.getSession().setTabSize(tabSize); }
  set opacity(opacity: number) { this._element.style.opacity = opacity.toString(); }

  public addCommand(newCommands: {name: string, key: {win: string, mac: string}, func: () => void}[] ) {
    newCommands.forEach(command => {
      this._editor.commands.addCommand({
        name: command.name,
        bindKey: command.key,
        exec: command.func,
      });
    });
  }
  public addEvent(type: string, event: (e: any) => void) {
    switch (type) {
      case 'blur':
        this._editor.on('blur', event as () => void);
        break;
      case 'change':
        this._editor.on('change', event as (e: AceAjax.EditorChangeEvent) => void);
        break;
      case 'changeSelectionStyle':
        this._editor.on('changeSelectionStyle', event as (data: object) => void);
        break;
      case 'changeSession':
        this._editor.on('changeSession', event as (e: object) => void);
        break;
      case 'copy':
        this._editor.on('copy', event as (obj: {text: string}) => void);
        break;
      case 'focus':
        this._editor.on('focus', event as () => void);
        break;
      case 'paste':
        this._editor.on('paste', event as (obj: {text: string}) => void);
        break;
      case 'move':
        this._editor.getSelection().on('changeCursor', event as () => void);
        break;
      default:
        console.error('Editor.addEvent(): type ' + type + 'is not exist.');
        break;
    }
  }

  // public saveFile = () => {
  //   if(this._currentPath==='') {
  //     this.saveNewFile();
  //     return;
  //   }
  //
  // }
  // private saveNewFile = () => {
  //
  // }
  private readFile = (path: string): void => {
    this._currentPath = path;

    fs.readFile(path, (error, text) => {
      if(error!==null) {
        alert('error : ' + error);
        return;
      }
      this._editor.setValue(text.toString(), -1);
    });
  }
  private writeFile = (path: string, data: any) => {
    fs.writeFile(path, data, error => {
      if(error!==null) {
        alert('error : ' + error);
      }
    });
  }
}
