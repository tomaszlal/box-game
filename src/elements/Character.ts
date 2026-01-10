import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { container } from "tsyringe";
import { GameScene } from '../view/GameScene';
import { AnimationMixer, Group, LoopRepeat, MeshStandardMaterial, Object3DEventMap } from "three";

export class Character {

    private path: string = "/src/assets/characters/urban_teen_run.glb";
    private loader: GLTFLoader
    private gameScene!: GameScene;
    private model!: Group<Object3DEventMap>;
    private mixer!: AnimationMixer;

    constructor() {
        this.loader = new GLTFLoader();
        this.resolveDependencies();
        this.loader.load(this.path, (gltf) => {


            this.correctColor(gltf);
            // // debugger;
            // gltf.scene.traverse((child) => {
            //     //@ts-ignore
            //     if (child.isMesh && child.material instanceof MeshStandardMaterial) {
            //         // debugger;
            //         // Optional fix if metalness is wrong
            //         //@ts-ignore
            //         // child.material.metalness = 0;
            //         //@ts-ignore
            //         // child.material.roughness = 1;
            //         //@ts-ignore
            //         // child.material.color = { r: 0.8, g: 0.5, b: 0.2, iscolor: true };
            //         //@ts-ignore
            //         // if (child.material.color) {
            //         //     //@ts-ignore
            //         //     child.material.color.r *= 10;
            //         //     //@ts-ignore
            //         //     child.material.color.g *= 10;
            //         //     //@ts-ignore
            //         //     child.material.color.b *= 10;
            //         // }

            //     }
            // });


            this.model = gltf.scene;
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new AnimationMixer(this.model);
                const action = this.mixer.clipAction(gltf.animations[0]);
                // action.setLoop(LoopRepeat, Infinity);
                action.play();

            }
            this.model.position.set(0, 1, 0);

            // return this.model
            this.gameScene.add(this.model);



        });




        // this.loader.load("/src/assets/things/Barrel.glb", (gltf) => {
        //     const barrel = gltf.scene;
        //     barrel.scale.set(5, 5, 5);
        //     barrel.position.set(2, 0, 0);

        //     this.correctColor(gltf);

        //     this.gameScene.add(barrel);
        // });
        //  this.loader.load("/src/assets/characters/Male_survivor_1.glb", (gltf) => {
        //     const barrel = gltf.scene;
        //     // barrel.scale.set(5, 5, 5);
        //     barrel.position.set(2, 0, 0);

        //     // this.correctColor(gltf);

        //     this.gameScene.add(barrel);
        // });
    }

    private correctColor(gltf: GLTF) {
        gltf.scene.traverse((child) => {
            // @ts-ignore
            if (child.isMesh && child.material instanceof MeshStandardMaterial) {
                //@ts-ignore
                if (child.material.color) {
                    //@ts-ignore
                    child.material.color.r *= 10;
                    //@ts-ignore
                    child.material.color.g *= 10;
                    //@ts-ignore
                    child.material.color.b *= 10;
                }

            }
        });
    }

    private resolveDependencies() {
        this.gameScene = container.resolve(GameScene);
    }

    public update() {
        // const delta = clock.getDelta();
        this.mixer.update(0.016); // assuming 60 FPS, so ~16ms per frame
    }
}