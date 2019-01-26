import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as three from 'three';

import { Circle, CircleAttributes } from './circle';
import { Scene } from './scene';

@Component({
  selector: 'app-mpg',
  templateUrl: './mpg.component.html',
  styleUrls: ['./mpg.component.scss']
})
export class MpgComponent implements OnInit {
  @ViewChild('canvas') canvasElement: ElementRef;

  private scene: Scene;
  private camera: three.PerspectiveCamera;
  private renderer: three.WebGLRenderer;

  private targetFrequency: number;
  private nextTargetTime: number;

  private targetAttributes: CircleAttributes;

  ngOnInit(): void {
    window.addEventListener('resize', this.onWindowResize, false);

    this.scene = new Scene();
    this.renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.domElement.addEventListener('mousedown', this.onClick);
    this.camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.onWindowResize();

    this.targetFrequency = 0;
    this.nextTargetTime = Date.now();

    this.targetAttributes = new CircleAttributes();

    this.targetAttributes.sizeFunction = (x) => { return x < 0.5 ? x : 1 - x };
    this.targetAttributes.opacityFunction = (x) => { return 1 };
    this.targetAttributes.maxSize = 0.8;
    this.targetAttributes.duration = 4000;
    this.targetAttributes.speed = new three.Vector2(-this.scene.width / 2, -this.scene.height / 2).distanceTo(new three.Vector2(this.scene.width / 2, this.scene.height / 2)) / 4000;
    this.targetAttributes.color = 0x4286f4;

    this.scene.background = new three.Color(0x1c477c);
    this.scene.targetAttributes = this.targetAttributes;

    document.body.appendChild(this.renderer.domElement);
    this.addTestCircles();

    this.animate();
  }

  addTestCircles() {
    this.targetAttributes.speed = 0;
    this.scene.addTarget(new three.Vector3(-0.1, 0, 0));
    this.scene.addTarget(new three.Vector3(+0.1, 0, 0));
    this.scene.addTarget(new three.Vector3(-this.scene.width / 2 + 0.05, 0, 0));
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    if (Date.now() > this.nextTargetTime) {
      this.nextTargetTime += this.targetFrequency;
      this.scene.addTarget();
    }

    this.scene.update();
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = three.Math.degToRad(this.camera.fov);
    this.scene.height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.scene.width = this.scene.height * this.camera.aspect;
  }

  onClick = (event: MouseEvent) => {
    const clickCoord = new three.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
    let raycaster = new three.Raycaster();
    raycaster.setFromCamera(clickCoord, this.camera);
    this.scene.onClick(raycaster);
  }
}
