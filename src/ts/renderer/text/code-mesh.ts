import * as THREE from 'three';

import BaseObj from './obj';
import * as GC from './graphic-charactor';

class CodeMesh extends BaseObj{
  private _code: number;
  private _materialId: number;

  // public static _scene: THREE.Scene = new THREE.Scene();
  static _textGeometryList: GC.GeometryList;
  static _materialList: THREE.Material[];

  constructor(code?: string | number, materialId?: number) {
    super();
    this._code = !code ? GC.ASCII_ENTER : ( typeof(code)==='number' ? code : code.charCodeAt(0) );
    this._materialId = materialId ? materialId : 0;
    this.addMesh(this._code, this._materialId);
  }
  static initialize(scene: THREE.Scene) {
    CodeMesh._scene = scene;
    CodeMesh._textGeometryList = new GC.GeometryList();
    CodeMesh._materialList = [
      new THREE.MeshLambertMaterial({ color: '#fff', transparent: true, opacity: 1.0 }),
      new THREE.MeshLambertMaterial({ color: '#f00', transparent: true, opacity: 1.0 }),
      new THREE.MeshLambertMaterial({ color: '#0f0', transparent: true, opacity: 1.0 }),
      new THREE.MeshLambertMaterial({ color: '#00f', transparent: true, opacity: 1.0 }),
    ];
  }

  set code(code: number) {
    if(GC.isASCII(code)) {
      this._code = code;// change code
      // recreate mesh
      this.removeMesh();
      if(GC.isGraphicCharactor(code)) {
        this.addMesh(code, this._materialId);
        // this._mesh = this.createMesh(code, this._materialId);
      }
    } else {
      console.error('code' + code +  'is not exist in ascii-code.');
    }
  }
  set materialId(id: number) {
    if(this._materialId !== id) {
      this._materialId = id;
      if(this.mesh) {
        this.mesh.material = CodeMesh._materialList[this._materialId];
        this.mesh.material.needsUpdate = true;
      }
    }
  }
  // get opacity(): number {
  //   if(this._mesh) {
  //     if(this._mesh.material instanceof Array) {
  //       this._mesh.material = this._mesh.material[0];
  //     }
  //     return this._mesh.material.opacity;
  //   } else {
  //     return -1;
  //   }
  // }  set opacity(opacity: number) {
  //   if(this._mesh) {
  //     if(this._mesh.material instanceof Array) {
  //       this._mesh.material = this._mesh.material[0];
  //     }
  //     this._mesh.material.opacity = opacity;
  //   }
  // }

  public removeMesh = () => {
    if(this.mesh) {
      CodeMesh._scene.remove(this.mesh);
      this.mesh = null;
    }
  }
  public isExistMesh = (): boolean => { return this.mesh ? true : false; }
  public isGraphicCharactorCode = (): boolean => { return GC.isGraphicCharactor(this._code); }

  private addMesh = (charCode: string | number, materialId?: number) => {
    this.mesh = this.createMesh(charCode, materialId);
    if(this.mesh) CodeMesh._scene.add(this.mesh);
  }
  private createMesh = (charCode: string | number, materialId?: number): THREE.Mesh | null => {
    const code = typeof(charCode)==='number' ? charCode : charCode.charCodeAt(0);
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
