import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Light,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three';
import { GameScene } from './view/GameScene';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class Main {
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private cube!: Mesh;
  private light!: Light;
  private container: HTMLElement;
  private controls!: OrbitControls;
  private background!: any;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      console.error('Container element not found!');
      return;
    }

    this.scene = new GameScene();
    this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ antialias: true });

    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.cube = this.createBox();
    this.cube.position.y = 1


    this.background = this.createBackground();


    // Position the camera
    // this.camera.position.x = 1;
    this.camera.position.z = 5;
    this.camera.position.y = 1;

    this.light = new DirectionalLight(0xffffff, 1);
    // this.light.position.set(-1.5, 1.5, 1.5);
    this.light.position.z = 2;
    this.light.position.x = 2;
    this.light.position.y = 2;
    this.scene.add(this.light);

    // 3. Set up event listeners and start the animation loop
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.animate();
  }

  private createBox(): Mesh {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({ color: 0x007812 });
    return this.newMesh(geometry, material);
  }

   private createBackground() {
    const geometry = new BoxGeometry(10, 0.5, 10);
    const material = new MeshStandardMaterial({ color: 0xffffff });
   return this.newMesh(geometry, material);
  }

  private newMesh(geometry: BoxGeometry, material: MeshStandardMaterial): Mesh {
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
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
    // this.cube.rotation.y += 0.01;
    // this.light.translateX(-0.01);


    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}