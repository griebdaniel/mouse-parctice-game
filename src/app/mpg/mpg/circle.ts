import * as three from 'three';

export class CircleAttributes {
  maxSize: number;
  duration: number;
  speed: number;
  sizeFunction: (x: number) => number;
  opacityFunction: (x: number) => number;
  color: number;
  creationTime: number;
  direction: three.Vector3;
}

export class Circle extends three.Mesh {
  maxSize: number;
  duration: number;
  speed: number;
  sizeFunction: (x: number) => number;
  opacityFunction: (x: number) => number;
  color: number;

  creationTime: number;
  direction: three.Vector3;

  constructor(attributes?: CircleAttributes) {
    super(new three.CircleGeometry(1, 200));

    this.maxSize = attributes.maxSize;
    this.duration = attributes.duration;
    this.speed = attributes.speed;
    this.sizeFunction = attributes.sizeFunction;
    this.opacityFunction = attributes.opacityFunction;
    this.color = attributes.color;

    this.material = new three.MeshBasicMaterial({ color: this.color });
    this.creationTime = Date.now();
  }

  getSize(time: number) {
    return this.sizeFunction((time - this.creationTime) / this.duration);
  }


}