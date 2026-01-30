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
        // const helper = new CameraHelper(this.light.shadow.camera);
        // this.scene.add(helper);
        this.floor = new Floor(100, "/src/assets/grass.jpg");
        this.scene.add(this.floor);


        this.moveController = new MoveController(this.floor.position.y);



        this.player = await this.createCharacter(this.camera);

        this.moveController.setPlayerCharacter(this.player, this.character);

        const cube = this.createCube();
        cube.position.set(0, 0.5, -5);
        this.scene.add(cube);
        this.moveController.addElementsForGravity(cube);

        const cube2 = this.createCube();
        cube2.position.set(2, 0.5, -5);
        this.scene.add(cube2);
        this.moveController.addElementsForGravity(cube2);

        const cube3 = this.createCube();
        cube3.position.set(-2, 0.5, -5);
        this.scene.add(cube3);
        this.moveController.addElementsForGravity(cube3);

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

    //TODO: Remove this method nod needed anymore
    private createCube(): Box {
        const cubeParameters: TBox = {
            width: 1,
            height: 1,
            depth: 1,
            color: 0x007812
        };
        const playerGroup = new Group();
        this.scene.add(playerGroup);
        return this.createBoxElement(cubeParameters);
    }

    private async createCharacter(camera: PerspectiveCamera): Promise<Group> {
        this.character = await new Character().load();

        const playerGroup = new Group();
        this.scene.add(playerGroup);
        this.character.model.rotation.y = Math.PI; // Rotate 180 degrees to face the camera
        playerGroup.add(this.character.model);
        playerGroup.add(camera);

        return playerGroup;
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        // this.light.translateX(-0.01);
        this.moveController.update();
        this.character.update();
        this.renderer.render(this.scene, this.camera);
    }
}