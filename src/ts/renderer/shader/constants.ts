import * as THREE from 'three';

export const DEFAULT_FRAGMENT_SHADER = `precision highp float;
uniform float time;
uniform vec2 resolution;

const float PI = 3.14159265359;

void main(){
  vec2 p = (gl_FragCoord.xy*2.0 - resolution)/min(resolution.x, resolution.y);
  vec3 color = vec3(0.1+0.1*sin(time));
  gl_FragColor = vec4(color, 1.0);
}`;
export const DEFAULT_VERTEX_SHADER = `precision highp float;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export interface IUniforms {
  [key: string]: {
    type: string;
    value: any;
  }
}
export const initUniforms: IUniforms = THREE.UniformsUtils.merge([
  {
    time: { type: 'f', value: 0.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
  },
  THREE.UniformsLib.common,
]);

export interface IShader {
  uniforms: IUniforms;
  vs: string;
  fs: string;
}
