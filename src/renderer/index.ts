import { ipcRenderer } from 'electron';

import TextEditor from './editor';
import Renderer from './main-renderer';

import {
  DEFAULT_FRAGMENT_SHADER,
} from './main-renderer/shader/constants';

const editor = new TextEditor('editor');
editor.value = DEFAULT_FRAGMENT_SHADER;

const renderer = new Renderer('renderer', editor.value);

window.addEventListener('resize', () => {
  renderer.resize(window.innerWidth, window.innerHeight);
});

editor.addCommand([
  {
    name: 'load shader',
    key: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
    func: () => {
      console.log('load shader.');
      renderer.loadShader(editor.value);
    },
  },
  {
    name: 'toggle 2D editor',
    key: {win: 'Ctrl-E', mac: 'Command-E'},
    func: () => {
      console.log('toggle editor');
      editor.opacity = editor.opacity===0 ? 1 : 0;
    }
  }
]);

editor.addEvent('change', (e: AceAjax.EditorChangeEvent) => {
  renderer.changeText(e, editor.value);

  // osc send
  // let array: string[] = [];
  // array.push(editor.value);// , e.action, e.start.row.toString(), e.start.column.toString(), e.end.row.toString(), e.end.column.toString()
  // ipcRenderer.send('client', array);

  // midi.send('loopMIDI Port', [0x90, 36, 0x3f]);
  // const note = 36+Math.random();
  // midi.send('loopMIDI Port', [0x80, 0x45, 0x3f]);
});

editor.addEvent('move', (e: any) => {
  renderer.moveCursor(editor.cursor);
});

renderer.play();
