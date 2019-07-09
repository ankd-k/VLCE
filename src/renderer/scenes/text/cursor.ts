import * as THREE from 'three';
import BaseObj from './base-obj';

class Cursor extends BaseObj {
  private _textPos: AceAjax.Position;

  private _meshPos: THREE.Vector3;

  private _preMoveTime: number;

  constructor(scene: THREE.Scene) {
    super();
    this._textPos = { row: 0, column: 0 };
    const geometry = new THREE.BoxBufferGeometry(0.16, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#f00', transparent: true, opacity: 1 });

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this._meshPos = new THREE.Vector3();
    this.textPos = {row: 0, column: 0};

    this._preMoveTime = performance.now();
  }

  get textPos(): AceAjax.Position { return this._textPos; }
  get meshPos(): THREE.Vector3 { return this._meshPos; }

  set textPos(newPos: AceAjax.Position) {
    this._textPos.row = (0 <= newPos.row) ? newPos.row : 0;
    this._textPos.column = (0 <= newPos.column) ? newPos.column : 0;
    this._meshPos.x = this._textPos.column - 0.1;
    this._meshPos.y = -this._textPos.row + 0.25;

    this._preMoveTime = performance.now();
  }
  set meshPos(newPos: THREE.Vector3) {
    this._meshPos.set(newPos.x, newPos.y, newPos.z);
  }

  public update() {
    if (this.mesh) {
      this.mesh.position.add(
        this._meshPos.clone().sub(
          this.mesh.position.clone(),
        ).multiplyScalar(0.5),
      );
      if (this.mesh.material instanceof Array) {
        console.log('material is array.');
        this.mesh.material = this.mesh.material[0];
      }
      this.opacity *= 0.995;
    }
  }
}

export default Cursor;
