import * as THREE from 'three';
import BaseObj from './base-obj';

class Cursor extends BaseObj{
  private _textPos: AceAjax.Position;

  private _meshPos: THREE.Vector3;
  private _trackingCamera: THREE.Camera | null = null;
  private _cameraPos: THREE.Vector3;

  private _preMoveTime: number;

  constructor(scene: THREE.Scene, camera?: THREE.Camera) {
    super();
    this._textPos = { row: 0, column: 0 };
    const geometry = new THREE.BoxBufferGeometry(0.16, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: '#ccc', transparent: true, opacity: 1, });

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
    if (camera) this._trackingCamera = camera;

    this._meshPos = new THREE.Vector3();
    this._cameraPos = new THREE.Vector3();
    this.textPos = {row: 0, column: 0};

    this._preMoveTime = performance.now();
  }

  get textPos(): AceAjax.Position {
    return this._textPos;
  }
  set textPos(newPos: AceAjax.Position) {
    this._textPos.row = (0 <= newPos.row) ? newPos.row : 0;
    this._textPos.column = (0 <= newPos.column) ? newPos.column : 0;
    this._meshPos.x = this._textPos.column-0.1;
    this._meshPos.y = -this._textPos.row+0.25;

    if (this._trackingCamera) {
      this._cameraPos.x = this._textPos.column;
      this._cameraPos.y = -this._textPos.row;
    }

    this._preMoveTime = performance.now();
  }

  public update() {
    // mesh
    if(this.mesh) {
      this.mesh.position.add(
        this._meshPos.clone().sub(
          this.mesh.position.clone()
        ).multiplyScalar(0.5)
      );
      if(this.mesh.material instanceof Array) {
        console.log('material is array.');
        this.mesh.material = this.mesh.material[0];
      }
      this.opacity *= 0.99;

      // move camera
      if(this._trackingCamera) {
        // xy
        const currentZ = this._trackingCamera.position.z;
        this._trackingCamera.position.add(
          this._cameraPos.clone().sub(
            this._trackingCamera.position.clone()
          ).multiplyScalar(0.04)
        );
        this._trackingCamera.lookAt(this.mesh.position);
        // z
        const l = ((performance.now() - this._preMoveTime < 1500) ? 15 : 40) - currentZ;
        this._trackingCamera.position.z = currentZ + 0.03*l;
      }
    }
  }
}

export default Cursor;
