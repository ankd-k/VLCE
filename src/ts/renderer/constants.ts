import * as THREE from 'three';

export interface IRenderScene {
  _scene: THREE.Scene,
  _camera: THREE.Camera,

  _target?: THREE.WebGLRenderTarget | null;

  render: () => void,
}

export const GLSLPrimitiveTypes = [
  'void',
  'int',
  'float',
  'vec2',
  'vec3',
  'vec4',
  'mat2',
  'mat3',
  'mat4',
];
export const GLSLPrimitiveTypesRegExp = new RegExp(GLSLPrimitiveTypes.reduce((acc, cur) => acc+'|'+cur), 'g');

export const GLSLQualifier = [
  'in',
  'out',
  'inout',
  'uniform',
  'attribute',
  'varying',
  'precision',
  'lowp',
  'mediump',
  'highp',
  'const',
];
export const GLSLQualifierRegExp = new RegExp(GLSLQualifier.reduce((acc, cur) => acc+'|'+cur), 'g');

export const GLSLPreprocessor = [
  '#define',
  '#if',
  '#else',
  '#ifdef',
  '#endif',
  '#version',
];
export const GLSLPreprocessorRegExp = new RegExp(GLSLPreprocessor.reduce((acc, cur) => acc + '|' + cur));

export const GLSLBuiltInVariables = [
  'gl_FragCoord',
  'gl_FragColor',
  'gl_PointCoord',
  'gl_PointSize',
  'gl_Position',
  'gl_VertexID',
];
export const GLSLBuiltInVariablesRegExp = new RegExp(GLSLBuiltInVariables.reduce((acc, cur) => acc+'|'+cur), 'g');

export const GLSLFunctions = [
  'abs',
  'acos',
  'asin',
  'atan',
  'ceil',
  'clamp',
  'cos',
  'cross',
  'dFdx',
  'dFdy',
  'distance',
  'dot',
  'exp',
  'floor',
  'fract',
  'inverse',
  'length',
  'log',
  'max',
  'min',
  'mix',
  'mod',
  'normalize',
  'pow',
  'reflect',
  'round',
  'sin',
  'smoothstep',
  'sqrt',
  'step',
  'tan',
  'texture',
  'texture2D',
];
export const GLSLFunctionsRegExp = new RegExp(GLSLFunctions.reduce((acc, cur) => acc+'|'+cur), 'g');
