import {
    BoxGeometry,
    CameraHelper,
    DirectionalLight,
    DoubleSide,
    Group,
    HemisphereLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    TextureLoader
} from "three";
import { GameDirectionalLight } from "../view/GameDirectionalLight";
import { Box } from "../elements/Box";
import { TBox } from '../types/Types';
import { MoveController } from "./MoveController";
import { Floor } from "../elements/Floor";
import { Character } from "../elements/Character";
import { GameScene } from "../view/GameScene";
import { container } from "tsyringe";
import { GameRenderer } from "../view/GameRenderer";

export class GameDirector {
    private camera!: PerspectiveCamera;
    private player!: Group;
    private floor!: Floor;
    private light!: DirectionalLight;
    private moveController!: MoveController;
    private scene!: GameScene;
    private renderer!: GameRenderer;
    private character!: Character;

    constructor() {
        this.resolveDependencies();
        this.init();
    }

    private async init() {
        this.camera = this.createCamera();
        this.light = new GameDirectionalLight(0xffffff, 1);
        this.scene.add(this.light);

        // const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.5); // Sky color, Ground color, Intensity
        // hemiLight.position.set(0, 20, 0);
        // this.scene.add(hemiLight)
        //TODO: Only for debugging shadow camera
        const helper = new CameraHelper(this.light.shadow.camera);
        this.scene.add(helper);

        this.player = await this.createCharacter(this.camera);
        // this.scene.add(this.player);
        this.floor = new Floor(100, "/src/assets/grass.jpg");
        this.scene.add(this.floor);
        this.moveController = new MoveController(this.floor.position.y);
        this.moveController.setPlayerGroup(this.player);
        // this.character = new Character();
        // this.createCharacter(this.camera);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.animate();
    }

    private resolveDependencies() {
        this.scene = container.resolve(GameScene);
        this.renderer = container.resolve(GameRenderer);
    }

    private createCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
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

    private async createCharacter(camera: PerspectiveCamera): Promise<Group> {
        this.character = await new Character().load();

        const playerGroup = new Group();
        this.scene.add(playerGroup);
        playerGroup.add(this.character.model);
        playerGroup.add(camera);

        // const playerGroup = new Group();
        // this.scene.add(playerGroup);
        // const cube = this.createBoxElement(cubeParameters);
        // cube.position.y = 5
        // playerGroup.add(cube);
        // playerGroup.add(camera);
        return playerGroup;
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
        // this.character.update();
        this.renderer.render(this.scene, this.camera);
    }
}