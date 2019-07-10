import * as THREE from 'three';

export default class BaseObj {
  public static _scene: THREE.Scene;
  private _mesh: THREE.Mesh | null;

  constructor() {
    this._mesh = null;
  }

  get mesh() { return this._mesh; }
  get position() { return this._mesh ? this._mesh.position : null; }
  get rotation() { return this._mesh ? this._mesh.rotation : null; }
  get scale() { return this._mesh ? this._mesh.scale : null; }
  get material() { return this._mesh ? this._mesh.material : null; }
  get opacity() {
    return this.material ?
     (this.material instanceof Array ? this.material[0].opacity : this.material.opacity) : 0;
   }

  set mesh(m: THREE.Mesh | null) { this._mesh = m; }
  set position(p: THREE.Vector3 | null) { if (p && this._mesh) { this._mesh.position.set(p.x, p.y, p.z); } }
  set x(x: number) { if (this._mesh) { this._mesh.position.x = x; } }
  set y(y: number) { if (this._mesh) { this._mesh.position.y = y; } }
  set z(z: number) { if (this._mesh) { this._mesh.position.z = z; } }
  set euler(euler: THREE.Euler | null) { if (euler && this._mesh) { this._mesh.rotation.set(euler.x, euler.y, euler.z); } }
  set eulerX(rx: number) { if (this._mesh) { this._mesh.rotation.x = rx; } }
  set eulerY(ry: number) { if (this._mesh) { this._mesh.rotation.y = ry; } }
  set eulerZ(rz: number) { if (this._mesh) { this._mesh.rotation.z = rz; } }
  set scale(s: THREE.Vector3 | null) { if (s && this._mesh) { this._mesh.scale.set(s.x, s.y, s.z); } }
  set scaleX(sx: number) { if (this._mesh) { this._mesh.scale.x = sx; } }
  set scaleY(sy: number) { if (this._mesh) { this._mesh.scale.y = sy; } }
  set scaleZ(sz: number) { if (this._mesh) { this._mesh.scale.z = sz; } }
  set material(m: THREE.Material | THREE.Material[] | null) { if (m && this._mesh) { this._mesh.material = m; } }
  set opacity(o: number) {
    if (this.material) {
      if (this.material instanceof Array) {
        this.material.forEach(m => {
          m.opacity = o;
        });
      } else {
        this.material.opacity = o;
      }
    }
  }
}
