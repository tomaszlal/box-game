import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { AnimationMixer, Group, MeshStandardMaterial, Object3DEventMap } from "three";

export class Character {

    private path: string = "/src/assets/characters/knight_GTLF.glb";
    private loader!: GLTFLoader
    public model!: Group<Object3DEventMap>;
    public mixer!: AnimationMixer;

    constructor() {

    }

    public async load(): Promise<Character> {
        this.loader = new GLTFLoader();
        const gltf = await this.loader.loadAsync(this.path);
        this.model = gltf.scene;
        if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new AnimationMixer(this.model);
            const action = this.mixer.clipAction(gltf.animations[9]);
            // action.setLoop(LoopRepeat, Infinity);
            // action.play();
        }
        this.model.position.set(0, 0, 0);
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.children[0].children.forEach((child) => {
            child.castShadow = true;
            // child.receiveShadow = true;
        });
        return this;
    };

    // this.loader.load("/src/assets/things/Barrel.glb", (gltf) => {
    //     const barrel = gltf.scene;
    //     barrel.scale.set(5, 5, 5);
    //     barrel.position.set(2, 0, 0);
    //     this.correctColor(gltf);
    //     this.gameScene.add(barrel);
    // });



    // private resolveDependencies() {
    //     this.gameScene = container.resolve(GameScene);
    // }

    public update() {
        this.mixer.update(0.016); // assuming 60 FPS, so ~16ms per frame
    }

    private correctColor(gltf: GLTF) {
        gltf.scene.traverse((child) => {
            // @ts-ignore
            if (child.isMesh && child.material instanceof MeshStandardMaterial) {
                //@ts-ignore
                if (child.material.color) {
                    // Optional fix if metalness or low color from model poly.pizza
                    //@ts-ignore
                    // child.material.metalness = 0;
                    //@ts-ignore
                    // child.material.roughness = 1;
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
}