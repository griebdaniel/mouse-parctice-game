import * as three from 'three';
import * as lodash from 'lodash';
import { Circle, CircleAttributes } from './circle';


export class Scene extends three.Scene {
  public width: number;
  public height: number;

  public targetAttributes: CircleAttributes;
  public clickAttributes: CircleAttributes;

  time: number;

  constructor() {
    super();
  }

  get circles(): Circle[] {
    return <Circle[]>this.children;
  }

  update() {
    this.time = Date.now();

    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];

      if (this.time - circle.creationTime > circle.duration) {
        this.remove(circle);
        i--;
        continue;
      }

      this.resolveSizeIntersection(circle);
      this.resolveCollision(circle);
      circle.scale.set(Math.max(circle.getSize(this.time), 0.001), Math.max(circle.getSize(this.time), 0.001), 1);
    }
  }

  resolveSizeIntersection(circle: Circle) {
    const xIntersectionLength = Math.max(0, Math.abs(circle.position.x) + circle.getSize(this.time) - (this.width / 2));
    const yIntersectionLength = Math.max(0, Math.abs(circle.position.y) + circle.getSize(this.time) - (this.height / 2));

    if (xIntersectionLength > 0 || yIntersectionLength) {
      circle.position.x += xIntersectionLength * Math.sign(-circle.position.x);
      circle.position.y += yIntersectionLength * Math.sign(-circle.position.y);
      this.resolveSizeIntersection(circle);
    }

    for (let i = 0; i < this.circles.length; i++) {
      const circle2 = this.circles[i];

      if (circle === circle2) {
        continue;
      }

      const intersectionLength = circle.getSize(this.time) + circle2.getSize(this.time) - circle.position.distanceTo(circle2.position);
      if (intersectionLength > 0) {
        circle2.position.add(circle2.position.clone().sub(circle.position).normalize().multiplyScalar(intersectionLength + 0.0001));
        this.resolveSizeIntersection(circle2);
      }
    }
  }

  resolveCollision(circle: Circle) {
    for (let i = 0; i < this.circles.length; i++) {
      const circle2 = this.circles[i];

      if (circle === circle2) {
        continue;
      }

      const intersectionLength = circle.getSize(this.time) + circle2.getSize(this.time) - circle.position.distanceTo(circle2.position);
      if (intersectionLength > 0) {
        circle2.position.add(circle2.position.clone().sub(circle.position).normalize().multiplyScalar(intersectionLength + 0.0001));
        this.resolveSizeIntersection(circle2);
      }
    }
  }

  addTarget(position?: three.Vector3) {
    const target = new Circle(this.targetAttributes); 

    if (position) {
      target.position.set(position.x, position.y, position.z);
    } else {
      target.position.set(lodash.random(-this.width / 2, this.width / 2), lodash.random(-this.height / 2, this.height / 2), 0);
    }

    this.add(target);
  }

  onClick(raycaster: three.Raycaster) {
    this.children = this.children.filter((circle: any) => raycaster.intersectObject(circle).length === 0);
  }
}