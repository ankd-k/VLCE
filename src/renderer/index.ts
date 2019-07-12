import { ipcRenderer } from 'electron';

import TextEditor from './editor';
import Scenes from './scenes';

import {
  DEFAULT_FRAGMENT_SHADER,
} from './scenes/shader/constants';

class Renderer {
  editor: TextEditor;
  scenes: Scenes;

  constructor() {
    this.editor = new TextEditor('editor');
    this.scenes = new Scenes('scenes', DEFAULT_FRAGMENT_SHADER);
    this.setup();
    this.scenes.play();
  }

  private setup = () => {
    this.editor.value = DEFAULT_FRAGMENT_SHADER;
    this.scenes.resize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
      this.scenes.resize(window.innerWidth, window.innerHeight);
    });

    this.editor.addCommand([
      {
        name: 'load shader',
        key: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        func: () => {
          console.log('load shader.');
          this.scenes.loadShader(this.editor.value);
        },
      },
      {
        name: 'toggle 2D editor',
        key: {win: 'Ctrl-E', mac: 'Command-E'},
        func: () => {
          console.log('toggle editor');
          this.editor.opacity = this.editor.opacity===0 ? 1 : 0;
        }
      },
      {
        name: 'load',
        key: { win: 'Ctrl-O', mac: 'Command-O' },
        func: () => {
          this.editor.load();
        }
      },
      {
        name: 'save',
        key: { win: 'Ctrl-S', mac: 'Command-S' },
        func: () => {
          this.editor.save();
        }
      }
    ]);

    this.editor.addEvent([
      {
        type: 'change',
        callback: (e: AceAjax.EditorChangeEvent) => {
          this.scenes.changeText(e, this.editor.value);
        }
      },
      {
        type: 'move',
        callback: (e: any) => {
          this.scenes.moveCursor(this.editor.cursor);
        }
      }
    ]);
  }
}

const renderer: Renderer = new Renderer();
