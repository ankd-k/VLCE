import * as THREE from 'three';
import {
  IRenderScene,
} from '../constants';
import {
  DEFAULT_FRAGMENT_SHADER,
  DEFAULT_VERTEX_SHADER,
  initUniforms,
} from './constants';

class ShaderScene implements IRenderScene{
  private _renderer: THREE.WebGLRenderer;
  _scene: THREE.Scene;
  _camera: THREE.OrthographicCamera;

  private _shader: THREE.ShaderMaterial;

  private _planeGeometry: THREE.PlaneBufferGeometry;
  private _plane: THREE.Mesh;

  private _clock: THREE.Clock;

  constructor(renderer: THREE.WebGLRenderer, clock?: THREE.Clock) {
    this._renderer = renderer;
    let size = new THREE.Vector2();
    this._renderer.getSize(size);

    this._scene = new THREE.Scene();
    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 2);
    this._camera.position.z = 1;

    this._planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
    this._shader = new THREE.ShaderMaterial({
      uniforms: initUniforms,
      fragmentShader: DEFAULT_FRAGMENT_SHADER,
      vertexShader: DEFAULT_VERTEX_SHADER,
    });
    this.resize(size.x, size.y);

    this._plane = new THREE.Mesh(this._planeGeometry, this._shader);
    this._scene.add(this._plane);

    this._clock = (clock) ? clock : new THREE.Clock();
    this._clock.start();
  }

  public render = (target?: THREE.WebGLRenderTarget) => {
    this._shader.uniforms.time.value = this._clock.getElapsedTime();

    this._renderer.setRenderTarget(target ? target : null);
    this._renderer.render(this._scene, this._camera);
  }
  public resize = (width: number, height: number) => {
    this._shader.uniforms.resolution.value = new THREE.Vector2(width, height);
  }

  public loadFragmentShader = (fs: string) => {
    this.loadShader({ fs: fs });
  }
  public loadVertexShader = (vs: string) => {
    this.loadShader({ vs: vs });
  }
  private loadShader = (shaders: { fs?: string, vs?:string }) => {
    if(shaders.fs) {
      this._shader.fragmentShader = shaders.fs;
    }
    if(shaders.vs) {
      this._shader.vertexShader = shaders.vs;
    }
    this._shader.needsUpdate = true;
    console.log(this._plane);
  }
}

export default ShaderScene;
