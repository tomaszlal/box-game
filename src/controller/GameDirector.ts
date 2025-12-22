import {
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GameDirectionalLight } from "../view/GameDirectionalLight";
import { Box } from "../elements/Box";
import { TBox } from '../types/TypesElements';

export class GameDirector {
    private camera: PerspectiveCamera;
    private controls: OrbitControls;
    private cube: Box;
    private background: Mesh;
    private light: DirectionalLight;

    constructor(
        private scene: Scene,
        private renderer: WebGLRenderer
    ) {
        this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Position the camera
        this.camera.position.z = 5;
        this.camera.position.y = 1;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.light = new GameDirectionalLight(0xffffff, 1);
        this.scene.add(this.light);


        this.cube = this.createCube();
        this.cube.position.y = 1
        this.background = this.createBackground();
        console.log(this.cube.getHeight());
        // 3. Set up event listeners and start the animation loop
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.animate();
    }

    private createBoxElement(boxData: TBox): Box {
        const geometry = new BoxGeometry(boxData.width, boxData.height, boxData.depth);
        const material = new MeshStandardMaterial({ color: boxData.color });
        const cube = new Box(geometry, material);
        this.scene.add(cube);
        return cube;
    }

    private createCube(): Box {
        const cubeParameters: TBox = {
            width: 1,
            height: 1,
            depth: 1,
            color: 0x007812
        };
        return this.createBoxElement(cubeParameters);
    }

    private createBackground(): Box {
        const cubeParameters: TBox = {
            width: 20,
            height: 0.5,
            depth: 20,
            color: 0xffffff
        };
        return this.createBoxElement(cubeParameters);
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