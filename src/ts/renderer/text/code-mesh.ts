import * as THREE from 'three';

import * as GC from './graphic-charactor';

export default class CodeMesh {
  private _code: number;
  private _mesh: THREE.Mesh | null;
  private _materialId: number;

  private static _textGeometryList: GC.GeometryList = new GC.GeometryList();
  private static _materialList: THREE.Material[] = [
    new THREE.MeshLambertMaterial({ color: '#fff', wireframe: true, }),
    new THREE.MeshLambertMaterial({ color: '#f0f' }),
    new THREE.MeshLambertMaterial({ color: '#f00' }),
    new THREE.MeshLambertMaterial({ color: '#0ff' }),
  ];

  public static _scene: THREE.Scene = new THREE.Scene();

  constructor(code?: string | number, materialId?: number) {
      this._code = !code ? GC.ASCII_ENTER : ( typeof(code)==='number' ? code : code.charCodeAt(0) );
      this._materialId = materialId ? materialId : 0;
      this._mesh = null;
      this.addMesh(this._code, this._materialId);
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
      if(this._mesh) {
        this._mesh.material = CodeMesh._materialList[this._materialId];
        this._mesh.material.needsUpdate = true;
      }
    }
  }
  set position(pos: THREE.Vector3) {
    if(this._mesh) {
      this._mesh.position.set(pos.x, pos.y, pos.z);
    }
  }
  set x(x: number) { if(this._mesh) this._mesh.position.x = x; }
  set y(y: number) { if(this._mesh) this._mesh.position.y = y; }
  set z(z: number) { if(this._mesh) this._mesh.position.z = z; }

  public removeMesh = () => {
    if(this._mesh) {
      CodeMesh._scene.remove(this._mesh);
      this._mesh = null;
    }
  }
  public isExistMesh = (): boolean => { return this._mesh ? true : false; }
  public isGraphicCharactorCode = (): boolean => { return GC.isGraphicCharactor(this._code); }

  private addMesh = (charCode: string | number, materialId?: number) => {
    this._mesh = this.createMesh(charCode, materialId);
    if(this._mesh) CodeMesh._scene.add(this._mesh);
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
