import * as THREE from 'three';

class ExtPerspectiveCamera extends THREE.PerspectiveCamera{
  private _cameraPos: THREE.Vector3;
  private _targetPos: THREE.Vector3;
  private _currentTargetPos: THREE.Vector3;
  private _lastSetTime: number;

  private _intensity: number;

  constructor(
    fov?: number | undefined,
    aspect?: number | undefined,
    near?: number | undefined,
    far?: number | undefined,
  ) {
    super(fov, aspect,  near, far);
    this._cameraPos = new THREE.Vector3();
    this._targetPos = new THREE.Vector3();
    this._currentTargetPos = new THREE.Vector3();
    this._lastSetTime = 0;
    this._intensity = 0.05;
  }

  get cameraPos(): THREE.Vector3 { return this._cameraPos; }
  get targetPos(): THREE.Vector3 { return this._targetPos; }
  get currentTargetPos(): THREE.Vector3 { return this._currentTargetPos; }
  get intensity(): number { return this._intensity; }

  set position(p: THREE.Vector3) { this.position.set(p.x, p.y, p.z); this._lastSetTime = performance.now(); }
  set cameraPos(p: THREE.Vector3) { this._cameraPos.set(p.x, p.y, p.z); this._lastSetTime = performance.now(); }
  set targetPos(p: THREE.Vector3) { this._targetPos.set(p.x, p.y, p.z); this._lastSetTime = performance.now(); }
  set intensity(i: number) { this._intensity = i; this._lastSetTime = performance.now();}

  public update = () => {
    let offset: THREE.Vector3;
    let z: number;
    const time = performance.now();

    if(time - this._lastSetTime > 2000) {
      offset = new THREE.Vector3(
        10*Math.sin(time * 0.1 / 1000),
        10*Math.sin(time * 0.13 / 1000),
        0.
      );
      z = 50;
    } else {
      offset = new THREE.Vector3(0);
      z = 25;
    }

    this.cameraPos.setZ(z);
    this.position.add(
      this.cameraPos.clone().add(offset).sub(
        this.position.clone(),
      ).multiplyScalar(this._intensity),
    );
    this._currentTargetPos.add(
      this._targetPos.clone().sub(
        this._currentTargetPos.clone(),
      ).multiplyScalar(this._intensity),
    );
    this.lookAt(this._currentTargetPos);
  }
}

export default ExtPerspectiveCamera;
