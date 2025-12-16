import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Light,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three';
import { GameScene } from './view/GameScene';

export class Main {
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private cube!: Mesh;
  private light!: Light;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      console.error('Container element not found!');
      return;
    }

    this.scene = new GameScene();
    this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ antialias: true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x004512 });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

    // Position the camera
    // this.camera.position.x = 1;
    this.camera.position.z = 5;
    this.camera.position.y = 1;

    this.light = new PointLight(0xffffff);
    this.light.position.set(-1.5, 1.5, 1.5);
    //  this.light.position.z = 3;
    //   this.light.position.x = 3;
    //   this.light.position.y = 3;
    this.scene.add(this.light);

    // 3. Set up event listeners and start the animation loop
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.animate();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    // Animation logic: rotate the cube
    // this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.light.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}