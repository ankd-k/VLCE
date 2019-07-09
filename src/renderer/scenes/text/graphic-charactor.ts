import * as THREE from 'three';
import font from '../../../fonts/RictyDiminished_Regular.typeface.json';

export const ASCII_GRAPHIC_CHARACTOR_START: number = 0x21;
export const ASCII_GRAPHIC_CHARACTOR_END: number = 0x7e;
export const ASCII_GRAPHIC_CHARACTOR_LENGTH: number = 94;

export const ASCII_ENTER: number = 0x0a;
export const ASCII_SPACE: number = 0x20;

export const ASCII_START: number = 0x00;
export const ASCII_END: number = 0x7f;

export const isASCII = (code: string | number): boolean => {
  const c = typeof(code) === 'number' ? code : code.charCodeAt(0);
  return ASCII_START <= c && c <= ASCII_END;
}
export const isGraphicCharactor = (code : string | number ): boolean => {
  if (typeof(code) === 'number') {
    return (ASCII_GRAPHIC_CHARACTOR_START <= code && code <= ASCII_GRAPHIC_CHARACTOR_END);
  } else {
    const array = code.split('');
    return !array.find((c) => {
      const charCode = c.charCodeAt(0) ;
      return (charCode < ASCII_GRAPHIC_CHARACTOR_START || ASCII_GRAPHIC_CHARACTOR_END < charCode);
    });
  }
}

export const getGraphicCharactorCode = (code: string | number): number => {
  let charCode: number;
  if (typeof(code) === 'number') charCode = code;
  else {
    if (code.length !== 1) {
      console.error('getGraphicCharCode() : code is not number of char.');
      return -1;
    }
    charCode = code.charCodeAt(0);
  }
  return isGraphicCharactor(charCode) ? charCode : -1;
}

export class GeometryList {
  private _geometries: THREE.TextBufferGeometry[] = new Array<THREE.TextBufferGeometry>(ASCII_GRAPHIC_CHARACTOR_LENGTH);
  private _geometryParameters: THREE.TextGeometryParameters = {
    font: new THREE.Font(font),
    size: 1,
  };

  constructor() {
    const start = ASCII_GRAPHIC_CHARACTOR_START;
    for (let i = 0; i < ASCII_GRAPHIC_CHARACTOR_LENGTH; i++) {
      const char: string = String.fromCharCode(start + i);
      const geometry = new THREE.TextBufferGeometry(char, this._geometryParameters);
      geometry.scale(1, 1, 0.01);
      this._geometries[i] = geometry;
    }
  }

  public getGeometry = (code: string | number): THREE.TextBufferGeometry => {
    const charCode: number = getGraphicCharactorCode(code);
    return this._geometries[charCode - ASCII_GRAPHIC_CHARACTOR_START];
  }
  public getGeometies = (code: string): THREE.TextBufferGeometry[] => {
    const array = code.split('');
    return array.map(c => {
      return this.getGeometry(c);
    });
  }
}

// export
export default {
  ASCII_GRAPHIC_CHARACTOR_START,
  ASCII_GRAPHIC_CHARACTOR_END,
  ASCII_GRAPHIC_CHARACTOR_LENGTH,
  ASCII_ENTER,
  ASCII_SPACE,
  ASCII_START,
  ASCII_END,
  isGraphicCharactor,
  getGraphicCharactorCode,
  GeometryList,
};
