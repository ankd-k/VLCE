import * as THREE from 'three';

import {
  IRenderScene,
  GLSLPrimitiveTypesRegExp,
  GLSLBuiltInVariablesRegExp,
  GLSLFunctionsRegExp,
} from '../constants';

import Cursor from './cursor';
import CodeMesh from './code-mesh';
import * as GC from './graphic-charactor';

class TextScene implements IRenderScene {
  private _renderer: THREE.WebGLRenderer;
  _scene : THREE.Scene;
  _camera : THREE.PerspectiveCamera;
  private _clock: THREE.Clock;

  private _text: string;

  private _codeMeshes: CodeMesh[][];

  private _cursor: Cursor;

  constructor(renderer: THREE.WebGLRenderer, clock?: THREE.Clock, initText?: string) {
    this._renderer = renderer;
    let size: THREE.Vector2 = new THREE.Vector2();
    this._renderer.getSize(size);
    this._clock = clock ? clock : new THREE.Clock();

    CodeMesh.initialize(new THREE.Scene());

    this._scene = CodeMesh._scene;
    console.log(this._scene);
    this._camera = new THREE.PerspectiveCamera(45, size.x / size.y, 0.1, 1000.0);

    // light
    const ambientLight = new THREE.AmbientLight('#fff', 0.3);
    this._scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight('#fff', 1.0);
    directionalLight.position.set(-1, 1, 1);
    directionalLight.lookAt(0, 0, 0);
    this._scene.add(directionalLight);

    this._text = (initText) ? initText : '';

    this._cursor = new Cursor(this._scene, this._camera);

    this._codeMeshes = [[new CodeMesh()]];

    if (this._text.length > 0){
      const linesArray = this._text.split('\n');
      this.insert(linesArray, { row: 0, column: 0 }, {row: linesArray.length, column: linesArray[linesArray.length - 1].length});
      // this.check({row: 0, column: 0},  {row: linesArray.length, column: linesArray[linesArray.length - 1].length});
    }

    this.resetPosition();
  }

  public render = (target?: THREE.WebGLRenderTarget) => {
    CodeMesh._materialList.forEach(m => {
      m.opacity = m.opacity*0.99;
    });

    this._cursor.update();

    this._renderer.setRenderTarget(target ? target : null);
    this._renderer.render(this._scene, this._camera);
  }
  public resize = (width: number, height: number) => {
    console.log('TextScene.resize()');
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
  public change = (e: AceAjax.EditorChangeEvent, text: string) => {
    this._text = text;
    switch (e.action) {
      case 'insert':
        this.insert(e.lines, e.start, e.end);
        this._cursor.textPos = { row: e.end.row, column: e.end.column };
        this.check(e.start, e.end);
        break;
      case 'remove':
        this.remove(e.start, e.end);
        this._cursor.textPos = { row: e.start.row, column: e.start.column };
        // check highlight
        this.check(e.start);
        break;
      default:
        break;
    }
    // position reset
    this.resetPosition();
    CodeMesh._materialList.forEach(m => {
      m.opacity = 1;
    });
  }
  public moveCursor(pos: AceAjax.Position) {
    console.log('moveCursor()');
    this._cursor.textPos = pos;
    this._cursor.opacity = 1.0;
  }

  private insert = (lines: string[], start: AceAjax.Position, end: AceAjax.Position) => {
    // insert code and mesh
    let row = start.row;
    let column = start.column;
    lines.forEach(line => {
      const lineArray = line.split('');
      lineArray.forEach(char => {
        const code: number = char.charCodeAt(0);
        this._codeMeshes[row].splice(column, 0, new CodeMesh(code));

        column++;
      });
      // if lines is not end
      if (row !== end.row){
        this.enter({row: row, column: column});
      }
      row++;
      column = 0;
    });
  }

  private remove = (start: AceAjax.Position, end: AceAjax.Position) => {
    for (let row = start.row; row <= end.row; row++) {
      // 1. remove meshes from scene.
      const columnStart = (row === start.row) ? start.column : 0;
      const columnEnd = (row === end.row) ? end.column : this._codeMeshes[row].length;
      for (let column = columnStart; column < columnEnd; column++) {
        this._codeMeshes[row][column].removeMesh();
      }
      // 2. remove codes and meshes from buffer
      const deleteCount = columnEnd - columnStart;
      this._codeMeshes[row].splice(columnStart, deleteCount);
    }

    if (start.row !== end.row) {
      const endLineCodeMeshes = this._codeMeshes[end.row].slice();
      this._codeMeshes.splice(start.row + 1, end.row - start.row);
      Array.prototype.push.apply(this._codeMeshes[start.row], endLineCodeMeshes);
    }
  }

  private enter = (position: AceAjax.Position) => {
    const row = position.row; const column = position.column;
    const lineLastIndex = this._codeMeshes[row].length - 1;
    // get entered objects
    const enterLineCodeMeshes: CodeMesh[] = this._codeMeshes[row].slice(column);

    // remove entered objects excluding last LF.
    this._codeMeshes[row].splice(column, lineLastIndex - column);

    // push or insert entered objects
    if (row < this._codeMeshes.length - 1) {
      this._codeMeshes.splice(row + 1, 0, enterLineCodeMeshes);
    } else if (row === this._codeMeshes.length - 1) {
      this._codeMeshes.push(enterLineCodeMeshes);
    } else {
      console.error('TextScene.enter() : row is out of range. row=', row, ', this._codeMeshes.length=', this._codeMeshes.length);
    }
  }

  private check = (start: AceAjax.Position, end?: AceAjax.Position) => {
    // regexp
    const textArray = this._text.split('\n');
    const endRow = (end) ? end.row : start.row;
    for(let row = start.row; row <= endRow; row++) {
      //const initColumn: number = this._codeMeshes[row].findIndex(key => !key.isExistMesh() );
      // const startColumn = this._meshes[row].indexOf(!null);
      const line: string = textArray[row];
      if(!line) continue;
      console.log('TextScene.check() : line=', line);//, ', initColumn=', initColumn);

      // syntax check
      let res;
      while(res = GLSLPrimitiveTypesRegExp.exec(line)) {
        console.log('primitive type : ', res, res.index);
      }
      while(res = GLSLBuiltInVariablesRegExp.exec(line)) {
        console.log('built-in variables : ', res);
      }
      while(res = GLSLFunctionsRegExp.exec(line)) {
        console.log('functions : ', res);
      }
      // console.log(
      //   'typesRegexp.exec(line)=', GLSLPrimitiveTypesRegExp.exec(line),
      //   '\nvariablesRegexp.exec(line)=', GLSLBuiltInVariablesRegExp.exec(line),
      //   '\nfunctionRegexp.exec(line)=', GLSLFunctionsRegExp.exec(line)
      // );


      // syntax highlight (legacy)
      // const words = line.split(/[\s.,(){}]/);
      // words.forEach(word => {
      //   // get materialId
      //   if (!word) return;
      //   let materialId: number = 0;
      //   if(GLSLPrimitiveTypes.find(key => key === word)) materialId = 1;
      //   else if(GLSLBuiltInVariables.find(key => key === word)) materialId = 2;
      //   else if(GLSLFunctions.find(key => key === word)) materialId = 3;
      //   console.log('TextScene.check() : word=', word, ', materialId=', materialId);
      //   // set materialId
      //   const l = word.length;
      //   const regexp = new RegExp(word, 'g');
      //   const index = line.match(regexp);
      //   console.log('regexp maching index=', index);
      //   const startColumn = initColumn + line.indexOf(word);
      //   const endColumn = startColumn + l;
      //   for(let column = startColumn; column < endColumn;column++) {
      //     if(materialId !== this._materialIds[row][column] ) {
      //       this._materialIds[row][column] = materialId;
      //       const mesh = this._meshes[row][column];
      //       if(mesh) {
      //         mesh.material = this._materialList[materialId];
      //         mesh.material.needsUpdate = true;
      //       }
      //     }
      //   }
      // });
    }
  }


  private resetPosition(start?: AceAjax.Position) {
    const startRow = start ? start.row : 0;
    this._codeMeshes.forEach((line, row) => {
      if(row<startRow) return;
      line.forEach((codeMesh, column) => {
        if (codeMesh.isExistMesh()) {
          codeMesh.x = column;
          codeMesh.y = -row;
        }
      });
    });
  }
  private executeAllCodeMeshes = (f: (mesh: CodeMesh)=>any) => {
    this._codeMeshes.forEach(line => { line.forEach(mesh => f(mesh)); });
  }
}

export default TextScene;
