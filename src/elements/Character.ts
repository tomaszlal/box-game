import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { container } from "tsyringe";
import { GameScene } from '../view/GameScene';
import { MeshStandardMaterial } from "three";

export class Character {

    private path: string = "/src/assets/characters/Adventurer.glb";
    private loader: GLTFLoader
    private gameScene!: GameScene;
    private model: any;

    constructor() {
        this.loader = new GLTFLoader();
        this.resolveDependencies();
        this.loader.load(this.path, (gltf) => {


            // debugger;
            gltf.scene.traverse((child) => {
                //@ts-ignore
                if (child.isMesh && child.material instanceof MeshStandardMaterial) {
                    // debugger;
                    // Optional fix if metalness is wrong
                    //@ts-ignore
                    // child.material.metalness = 0;
                    // //@ts-ignore
                    // child.material.roughness = 1;
                    //@ts-ignore
                    child.material.color = { r: 0.8, g: 0.5, b: 0.2, iscolor: true };
                }
            });


            this.model = gltf.scene;
            this.model.position.set(0, 0, 0);
            this.gameScene.add(this.model);



        });
    }

    private resolveDependencies() {
        this.gameScene = container.resolve(GameScene);
    }
}