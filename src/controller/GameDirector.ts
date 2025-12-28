import {
    BoxGeometry,
    CameraHelper,
    DirectionalLight,
    DoubleSide,
    Group,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    TextureLoader,
    WebGLRenderer
} from "three";
import { GameDirectionalLight } from "../view/GameDirectionalLight";
import { Box } from "../elements/Box";
import { TBox } from '../types/Types';
import { MoveController } from "./MoveController";


export class GameDirector {
    private camera: PerspectiveCamera;
    private player!: Group;
    private floor: Mesh;
    private light: DirectionalLight;
    private moveController: MoveController;

    constructor(
        private scene: Scene,
        private renderer: WebGLRenderer
    ) {
        this.camera = this.createCamera();
        this.light = new GameDirectionalLight(0xffffff, 1);
        this.scene.add(this.light);
        //TODO: Only for debugging shadow camera
        const helper = new CameraHelper(this.light.shadow.camera);
        this.scene.add(helper);

        this.player = this.createCharacterCube(this.camera);
        this.scene.add(this.player);
        this.floor = this.createFloor();
        this.scene.add(this.floor);
        this.moveController = new MoveController(this.floor.position.y);
        this.moveController.setPlayerGroup(this.player);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.animate();
    }

    private createCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Position the camera
        camera.position.z = 3.5;
        camera.position.x = 0.5;
        camera.position.y = 2.5;
        return camera;
    }

    private createBoxElement(boxData: TBox): Box {
        const geometry = new BoxGeometry(boxData.width, boxData.height, boxData.depth);
        const material = new MeshStandardMaterial({ color: boxData.color });
        const cube = new Box(geometry, material);
        return cube;
    }

    private createCharacterCube(camera: PerspectiveCamera): Group {
        const cubeParameters: TBox = {
            width: 1,
            height: 1,
            depth: 1,
            color: 0x007812
        };
        const playerGroup = new Group();
        this.scene.add(playerGroup);
        const cube = this.createBoxElement(cubeParameters);
        cube.position.y = 5
        playerGroup.add(cube);
        playerGroup.add(camera);
        return playerGroup;
    }

    //TODO: refactor to separate class
    private createFloor() {
        const planeGeometry = new PlaneGeometry(100, 100);
        const planeMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            side: DoubleSide
        });

        const textureLoader = new TextureLoader();
        const grassTexture = textureLoader.load("/src/assets/grass.jpg");
        grassTexture.wrapS = RepeatWrapping;
        grassTexture.wrapT = RepeatWrapping;
        grassTexture.repeat.set(10, 10);
        const grassMaterial = new MeshStandardMaterial({
            map: grassTexture,
            side: DoubleSide
        });

        const floor = new Mesh(planeGeometry, grassMaterial);
        // const floor = new Mesh(planeGeometry, planeMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        return floor;
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
        this.renderer.render(this.scene, this.camera);
    }
}