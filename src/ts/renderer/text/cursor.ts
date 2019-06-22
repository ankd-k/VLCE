import * as THREE from 'three';

class Cursor {
  private _position: AceAjax.Position;

  private _mesh: THREE.Mesh;
  private _meshPos: THREE.Vector3;
  private _trackingCamera: THREE.Camera | null = null;
  private _cameraPos: THREE.Vector3;

  private _preMoveTime: number;

  constructor(scene: THREE.Scene, camera?: THREE.Camera) {
    this._position = { row: 0, column: 0 };
    const geometry = new THREE.BoxBufferGeometry(0.16, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: '#ccc', transparent: true, opacity: 1, });

    this._mesh = new THREE.Mesh(geometry, material);
    scene.add(this._mesh);
    if (camera) this._trackingCamera = camera;

    this._meshPos = new THREE.Vector3();
    this._cameraPos = new THREE.Vector3();
    this.position = {row: 0, column: 0};

    this._preMoveTime = performance.now();
  }

  get position(): AceAjax.Position {
    return this._position;
  }
  set position(newPosition: AceAjax.Position) {
    this._position.row = (0 <= newPosition.row) ? newPosition.row : 0;
    this._position.column = (0 <= newPosition.column) ? newPosition.column : 0;
    this._meshPos.x = this._position.column-0.1;
    this._meshPos.y = -this._position.row+0.25;

    if (this._trackingCamera) {
      this._cameraPos.x = this._position.column;
      this._cameraPos.y = -this._position.row;
    }

    this._preMoveTime = performance.now();
  }
  get opacity(): number {
    if(this._mesh) {
      if(this._mesh.material instanceof Array) {
        this._mesh.material = this._mesh.material[0];
      }
      return this._mesh.material.opacity;
    } else {
      return 0;
    }
  }
  set opacity(opacity: number) {
    if(this._mesh) {
      if(this._mesh.material instanceof Array) {
        this._mesh.material = this._mesh.material[0];
      }
      this._mesh.material.opacity = opacity;
    }
  }

  public update() {
    // mesh
    this._mesh.position.add(
      this._meshPos.clone().sub(
        this._mesh.position.clone()
      ).multiplyScalar(0.5)
    );
    if(this._mesh.material instanceof Array) {
      console.log('material is array.');
      this._mesh.material = this._mesh.material[0];
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
      this._trackingCamera.lookAt(this._mesh.position);
      // z
      const l = ((performance.now() - this._preMoveTime < 1500) ? 15 : 40) - currentZ;
      this._trackingCamera.position.z = currentZ + 0.03*l;
    }
  }
}

export default Cursor;
