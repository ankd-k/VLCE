import TextEditor from './editor';
import Renderer from './renderer';

import MIDI from './extension/midi';

import {
  DEFAULT_FRAGMENT_SHADER,
} from './renderer/shader/constants';

// editor
const editor = new TextEditor('editor');
editor.value = DEFAULT_FRAGMENT_SHADER;
// renderer
const renderer = new Renderer('renderer', editor.value);
// midi
const midi = new MIDI();
midi.request();
console.log(midi.outputDevices);

window.addEventListener('resize', () => {
  renderer.resize(window.innerWidth, window.innerHeight);
});


// set events
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
      const editorElm = document.getElementById('editor');
      // console.log(editorElm);
      if(editorElm) {
        const currentOpacity = editorElm.style.opacity;
        editorElm.style.opacity = currentOpacity==='0' ? '1' : '0';
      }
    }
  }
]);
editor.addEvent('change', (e: AceAjax.EditorChangeEvent) => {
  // console.log('editor.change() ', e);
  renderer.changeText(e, editor.value);
  // midi.send('loopMIDI Port', [0x90, 36, 0x3f]);
  // renderer.loadText(editor.line);
  // const note = 36+Math.random();
  // midi.send('loopMIDI Port', [0x80, 0x45, 0x3f]);
});
editor.addEvent('move', (e: any) => {
  // console.log('editor.move() ', e);
  renderer.moveCursor(editor.cursor);
  // console.log('editor.move() ', e);
  // renderer.loadText(editor.line);
});

renderer.play();
