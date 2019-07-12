import * as THREE from 'three';

import TextScene from './text/text-scene';
import ShaderScene from './shader/shader-scene';

export default class Scenes {
  private _renderer: THREE.WebGLRenderer;
  private _canvas: HTMLCanvasElement;

  private _clock: THREE.Clock;

  private _textScene: TextScene;
  private _shaderScene: ShaderScene;
  private _targets: THREE.WebGLRenderTarget[];

  private _scene: THREE.Scene;
  private _camera: THREE.OrthographicCamera;
  private _plane: THREE.PlaneBufferGeometry;
  private _material: THREE.ShaderMaterial;
  private _mesh: THREE.Mesh;

  private _frameIndex: number;
  private _fps: number;

  constructor(id: string, initText?: string) {
    this._renderer = new THREE.WebGLRenderer();
    this._canvas = this._renderer.domElement;
    const element = document.getElementById(id);
    if (!element) {
      console.error('Renderer instancing: HTMLElement do not exist.');
    } else {
      this._renderer.setSize(element.clientWidth, element.clientHeight);
      element.appendChild(this._canvas);
    }
    let size = new THREE.Vector2();
    this._renderer.getSize(size);

    this._clock = new THREE.Clock();

    this._textScene = new TextScene(this._renderer, this._clock, initText); // DEFAULT_FRAGMENT_SHADER
    this._shaderScene = new ShaderScene(this._renderer, this._clock);

    this._targets = [
      new THREE.WebGLRenderTarget(size.x, size.y, {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      }),
      new THREE.WebGLRenderTarget(size.x, size.y, {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      }),
    ];

    this._scene = new THREE.Scene();
    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 15);
    this._camera.position.z = 1;

    const uniforms = {
      'time': { type: 'f', value: 0.0 },
      'resolution': { type: 'v2', value: new THREE.Vector2(size.x, size.y) },
      'textScene': { type: 't', value: this._targets[0].texture },
      'shaderScene': { type: 't', value: this._targets[1].texture },
    };
    const VERTEX_SHADER = `precision highp float;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
    const FRAGMENT_SHADER = `precision highp float;
    uniform vec2 resolution;
    uniform sampler2D textScene;
    uniform sampler2D shaderScene;
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec4 sceneA = clamp(texture2D(textScene, uv), 0., 1.);
      vec4 sceneB = clamp(texture2D(shaderScene, uv), 0., 1.);
      float ratio = normalize(vec2(sceneA.a, sceneB.a)).x;
      vec4 color = mix(sceneB, sceneA, ratio);
      gl_FragColor = color;
    }`;
    this._plane = new THREE.PlaneBufferGeometry(2, 2);
    this._material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    this._mesh = new THREE.Mesh(this._plane, this._material);
    this._scene.add(this._mesh);

    this._frameIndex = 0;
    this._fps = 60;
  }

  public play = () => {
    console.log('renderer play.');
    this._clock.start();
    this._frameIndex = 0;
    this.animate();
  }
  public resize = (width: number, height: number) => {
    console.log('resize(): width=', width, ', height=', height);
    this._renderer.setSize(width, height);

    this._targets.forEach(target => {
      target.setSize(width, height);
    });
    this._material.uniforms.resolution.value = new THREE.Vector2(width, height);

    this._textScene.resize(width, height);
    this._shaderScene.resize(width, height);
  }
  public changeText = (e: AceAjax.EditorChangeEvent, value: string) => {
    this._textScene.change(e, value);
  }
  public moveCursor = (pos: AceAjax.Position) => {
    this._textScene.moveCursor(pos);
  }
  public loadShader = (shader: string) => {
    this._shaderScene.loadFragmentShader(shader);
  }

  // rendering loop
  private animate = () => {
    requestAnimationFrame(this.animate);
    this._frameIndex++;
    if (this._frameIndex % 1 == 0) {
      this.render();
    }
  }
  private render = () => {
    if (!this._renderer) { return; }

    // this._shaderScene.render();

    this._textScene.render(this._targets[0]);
    this._shaderScene.render(this._targets[1]);
    this._renderer.setRenderTarget(null);
    this._renderer.render(this._scene, this._camera);
  }
}
