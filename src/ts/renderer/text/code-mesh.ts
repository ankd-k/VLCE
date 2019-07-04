import * as THREE from 'three';

import BaseObj from './base-obj';
import * as GC from './graphic-charactor';

class CodeMesh extends BaseObj{
  public static _textGeometryList: GC.GeometryList;
  public static _materialList: THREE.Material[];
  public static initialize(scene: THREE.Scene) {
    CodeMesh._scene = scene;
    CodeMesh._textGeometryList = new GC.GeometryList();
    CodeMesh._materialList = [
      new THREE.MeshLambertMaterial({ color: '#fff', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#f00', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#0f0', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#00f', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#ff0', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#0ff', transparent: true, opacity: 1.0, wireframe: true }),
      new THREE.MeshLambertMaterial({ color: '#f0f', transparent: true, opacity: 1.0, wireframe: true }),
    ];
  }

  private _code: number;
  private _materialId: number;

  constructor(code?: string | number, materialId?: number) {
    super();
    this._code = !code ? GC.ASCII_ENTER : ( typeof(code) === 'number' ? code : code.charCodeAt(0) );
    this._materialId = materialId ? materialId : 0;
    this.addMesh(this._code, this._materialId);
  }

  set code(code: number) {
    if (GC.isASCII(code)) {
      this._code = code; // change code
      // recreate mesh
      this.removeMesh();
      if (GC.isGraphicCharactor(code)) {
        this.addMesh(code, this._materialId);
        // this._mesh = this.createMesh(code, this._materialId);
      }
    } else {
      console.error('code' + code +  'is not exist in ascii-code.');
    }
  }
  set materialId(id: number) {
    if (this._materialId !== id) {
      this._materialId = id;
      if (this.mesh) {
        this.material = CodeMesh._materialList[this._materialId];
        this.material.needsUpdate = true;
      }
    }
  }

  public removeMesh = () => {
    if (this.mesh) {
      CodeMesh._scene.remove(this.mesh);
      this.mesh = null;
    }
  }
  public isExistMesh = (): boolean => this.mesh ? true : false;
  public isGraphicCharactorCode = (): boolean => GC.isGraphicCharactor(this._code);

  private addMesh = (charCode: string | number, materialId?: number) => {
    this.mesh = this.createMesh(charCode, materialId);
    if (this.mesh) CodeMesh._scene.add(this.mesh);
  }
  private createMesh = (charCode: string | number, materialId?: number): THREE.Mesh | null => {
    const code = typeof(charCode) === 'number' ? charCode : charCode.charCodeAt(0);
    if (GC.isGraphicCharactor(code)) {
      const geometry = CodeMesh._textGeometryList.getGeometry(code);
      const material = CodeMesh._materialList[(materialId) ? materialId : 0];
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    } else {
      return null;
    }
  }
}

export default CodeMesh;
