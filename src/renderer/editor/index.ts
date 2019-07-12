import ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-glsl';
import 'ace-builds/src-noconflict/theme-origin';
import 'ace-builds/src-noconflict/theme-monokai';

import { OpenDialogOptions, remote, SaveDialogOptions } from 'electron';

import fs from 'fs';
import path from 'path';

type TextEditorEventTypes =
  'blur' |
  'change' |
  'changeSelectionStyle' |
  'changeSession' |
  'copy' |
  'focus' |
  'paste' |
  'move';

class TextEditor {
  private _editor: ace.Ace.Editor;
  private _element: HTMLElement;
  private _currentPath: string = '';

  constructor(el: string | HTMLElement) {
    let element = (typeof(el) === 'string') ? document.getElementById(el) : el;
    if (!element) {
      console.error('element is not exist.', element);
      element = document.createElement('div');
      document.appendChild(element);
    }
    this._element = element;
    this._editor = ace.edit(this._element);

    this.fontSize = 18;
    this.mode = 'ace/mode/glsl';
    this.theme = 'ace/theme/origin';
    this.tabSize = 2;
    this._editor.setOption('showPrintMargin', false);
    this._editor.focus();
  }

  // getter
  get editor(): ace.Ace.Editor { return this._editor; }
  get value(): string { return this._editor.getValue(); }
  get line(): string { return this._editor.getSession().getLine(this._editor.getCursorPosition().row); }
  get cursor(): ace.Ace.Point { return this._editor.getSelection().getCursor(); }
  public getLines = (start: number, end?: number): string | string[] => {
    if (!end) return this._editor.getSession().getLine(start);
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

  public addCommand = (newCommands: { name: string, key: { win: string, mac: string }, func: () => void }[] ) => {
    newCommands.forEach(command => {
      this._editor.commands.addCommand({
        name: command.name,
        bindKey: command.key,
        exec: command.func,
      });
    });
  }
  public addEvent = (newEvents: { type: TextEditorEventTypes, callback: (e: any) => void }[]) => {
    newEvents.forEach(event => {
      switch (event.type) {
        case 'blur':
          this._editor.on('blur', event.callback as () => void);
          break;
        case 'change':
          this._editor.on('change', event.callback as (e: AceAjax.EditorChangeEvent) => void);
          break;
        case 'changeSelectionStyle':
          this._editor.on('changeSelectionStyle', event.callback as (data: object) => void);
          break;
        case 'changeSession':
          this._editor.on('changeSession', event.callback as (e: object) => void);
          break;
        case 'copy':
          this._editor.on('copy', event.callback as (obj: {text: string}) => void);
          break;
        case 'focus':
          this._editor.on('focus', event.callback as () => void);
          break;
        case 'paste':
          this._editor.on('paste', event.callback as (obj: {text: string}) => void);
          break;
        case 'move':
          this._editor.getSelection().on('changeCursor', event.callback as () => void);
          break;
        default:
          console.error('Editor.addEvent(): type ' + event.type + 'is not exist.');
          break;
      }
    });
  }


  public load = () => {
    const win: Electron.BrowserWindow = remote.getCurrentWindow();
    const opt: OpenDialogOptions = {
      properties: ['openFile'],
      filters: [
        {
          name: 'glsl',
          extensions: ['glsl', 'frag']
        }
      ]
    };

    remote.dialog.showOpenDialog(
      win,
      opt,
      (fileNames) => {
        if(fileNames) {
          this.readFile(fileNames[0]);
        }
      }
    );
  }
  public save = () => {
    this.writeFile(this._currentPath, this.value, () => {
      alert(`file is not exist in ${this._currentPath}, save as new file.`);
      this.saveAsNewFile();
    });
  }
  public saveAsNewFile = () => {
    const win: Electron.BrowserWindow = remote.getCurrentWindow();
    const opt: SaveDialogOptions = {
      filters: [
        {
          name: 'glsl',
          extensions: ['glsl', 'frag']
        }
      ]
    };
    remote.dialog.showSaveDialog(
      win,
      opt,
      (fileName) => {
        if(fileName) {
          this.writeFile(fileName, this.value);
          this._currentPath = fileName;
        }
      }
    );
  }

  private readFile = (path: string) => {
    fs.readFile(path, (error, text) => {
       if (error != null) {
          alert('error : ' + error);
          return;
       }
       this.value = text.toString();
    });
  }
  private writeFile = (path: string, text: string, cb?: (err?: NodeJS.ErrnoException) => void ) => {
    fs.writeFile(path, text, (err) => {
      if (err != null) {
        if(cb) cb(err);
        else {
          alert('TextEditor.writeFile() : write error.');
          return;
        }
        return;
      } else {
        console.log('save to ' + this._currentPath);
      }
    });
  }
}

export default TextEditor;
