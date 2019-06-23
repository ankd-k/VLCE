const regexpPrefix = '(?<=([\\W\\s]|^))(';
const regexpSuffix = ')\\b';
let regexp;

//------------------------------------------------------------------------------
// GLSL syntax Definition
//------------------------------------------------------------------------------
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
regexp = regexpPrefix + GLSLPrimitiveTypes.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLPrimitiveTypesRegExp = new RegExp(regexp, 'g');

export const GLSLBasicSyntax = [
  'for',
  'if',
  'switch',
  'case',
  'default',
  'while',
  'break',
  'continue',
  'return',
];
regexp = regexpPrefix + GLSLBasicSyntax.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLBasicSyntaxRegExp = new RegExp(regexp, 'g');

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
  'flat',
];
regexp = regexpPrefix + GLSLQualifier.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLQualifierRegExp = new RegExp(regexp, 'g');

export const GLSLPreprocessor = [
  '#define',
  '#if',
  '#else',
  '#ifdef',
  '#endif',
  '#version',
];
regexp = regexpPrefix + GLSLPreprocessor.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLPreprocessorRegExp = new RegExp(regexp, 'g');

export const GLSLBuiltInVariables = [
  'gl_FragCoord',
  'gl_FragColor',
  'gl_PointCoord',
  'gl_PointSize',
  'gl_Position',
  'gl_VertexID',
];
regexp = regexpPrefix + GLSLBuiltInVariables.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLBuiltInVariablesRegExp = new RegExp(regexp, 'g');

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
  'main',
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
regexp = regexpPrefix + GLSLFunctions.reduce((acc, cur) => acc+'|'+cur) + regexpSuffix;
export const GLSLFunctionsRegExp = new RegExp(regexp, 'g');

regexp = '\\w+\\b(?=\\()';
export const GLSLUserFuncitonRegExp = new RegExp(regexp, 'g');

//------------------------------------------------------------------------------
// function
//------------------------------------------------------------------------------
export function checkLineSyntax(line: string) {
  let materialIds: number[] = new Array(line.length);

  // reset all materialId to 0
  for(let i=0;i<line.length;i++) {
    materialIds[i] = 0;
  }

  let res;
  // set material id.
  //
  while(res = GLSLQualifierRegExp.exec(line)) {
    setMaterialId(res, 6);// ex) uniform, attribute, highp, precision, const, ....
  }
  while(res = GLSLPreprocessorRegExp.exec(line)) {
    setMaterialId(res, 2);// ex) #define, ...
  }
  while(res = GLSLBuiltInVariablesRegExp.exec(line)) {
    setMaterialId(res, 1);// ex) gl_FragColor, ...
  }
  while(res = GLSLFunctionsRegExp.exec(line)) {
    setMaterialId(res, 5);// ex) abs, sin, ...
  }
  while(res = GLSLUserFuncitonRegExp.exec(line)) {
    setMaterialId(res, 5);// ex) ~(
  }
  while(res = GLSLPrimitiveTypesRegExp.exec(line)) {
    setMaterialId(res, 6);// ex) int, float, mat3, ...
  }
  while(res = GLSLBasicSyntaxRegExp.exec(line)) {
    setMaterialId(res, 6);// ex) for, if, switch, ...
  }

  return materialIds;

  function setMaterialId(res: RegExpExecArray, id: number) {
    const startColumn = res.index;
    const endColumn = res.index + res[0].length;
    for(let column=startColumn; column<endColumn;column++) {
      materialIds[column] = id;
    }
  }
}
