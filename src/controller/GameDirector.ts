import {
    BoxGeometry,
    DirectionalLight,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GameDirectionalLight } from "../view/GameDirectionalLight";
import { Box } from "../elements/Box";
import { TBox } from '../types/Types';
import { MoveController } from "./MoveController";


export class GameDirector {
    private camera: PerspectiveCamera;
    private controls: OrbitControls;
    private cube: Box;
    private background: Box;
    private light: DirectionalLight;
    private moveController: MoveController;

    constructor(
        private scene: Scene,
        private renderer: WebGLRenderer
    ) {
        this.camera = this.createCamera();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.light = new GameDirectionalLight(0xffffff, 1);
        this.scene.add(this.light);

        this.cube = this.createCube();
        this.cube.position.y = 5
        this.background = this.createBackground();
        this.moveController = new MoveController(this.background.getPickPositionY());
        this.moveController.setPersonBox(this.cube);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.animate();
    }

    private createCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Position the camera
        camera.position.z = 7;
        camera.position.y = 1.5;
        return camera;  }

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
        const parameters: TBox = {
            width: 20,
            height: 0.5,
            depth: 20,
            color: 0xffffff
        };
        return this.createBoxElement(parameters);
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
        this.moveController.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}