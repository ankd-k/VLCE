import * as THREE from 'three';

export interface IRenderScene {
  _scene: THREE.Scene,
  _camera: THREE.Camera,

  _target?: THREE.WebGLRenderTarget | null;

  render: () => void,
}
