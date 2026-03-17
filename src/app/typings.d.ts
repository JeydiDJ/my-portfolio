declare module 'blobshape' {
  interface BlobShapeOptions {
    element: HTMLElement;
    numPoints?: number;
    randomness?: number;
    speed?: number;
  }

  export default class BlobShape {
    constructor(options: BlobShapeOptions);
    animate(): void;
  }
}