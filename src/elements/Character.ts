import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { AnimationMixer, Box3, Group, MeshStandardMaterial, Object3DEventMap, Vector3 } from "three";
import { PromiseUtils, ResolvablePromise } from "../utils/PromiseUtils";
import gsap from "gsap";

export class Character {

    private path: string = "/src/assets/characters/knight_GTLF.glb";
    private loader!: GLTFLoader
    public model!: Group<Object3DEventMap>;
    public mixer!: AnimationMixer;
    private gltf!: GLTF;
    private canJump: boolean = true;
    private promiseGravity: ResolvablePromise<void> = PromiseUtils.getResolvablePromise<void>();
    private onGround: boolean = false;

    constructor() {
        this.init();
    }

    private init() {
        this.promiseGravity.resolve();
    }

    public async load(): Promise<Character> {
        this.loader = new GLTFLoader();
        this.gltf = await this.loader.loadAsync(this.path);
        this.model = this.gltf.scene;
        if (this.gltf.animations && this.gltf.animations.length > 0) {
            this.mixer = new AnimationMixer(this.model);
            const action = this.mixer.clipAction(this.gltf.animations[9]);
            // action.setLoop(LoopRepeat, Infinity);
            // action.play();
        }
        this.model.position.set(0, 5, 0);
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.children[0].children.forEach((child) => {
            child.castShadow = true;
        });
        return this;
    };

    public play() {
        if (this.mixer) {
            const action = this.mixer.clipAction(this.gltf.animations[9]);
            action.play();
        }
    }

    public async jump(height: number = 2): Promise<void> {
        if (!this.canJump || !this.promiseGravity.resolved) {
            console.log(`dont jump   jump:${this.canJump} on ground:${this.onGround}`);
            return;
        }
        this.canJump = false;
        const tl = gsap.timeline();
        const jumpHeight = this.model.position.y + height;
        tl.to(this.model.position, {
            y: jumpHeight,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
                this.onGround = false;
            },
        });
    }

    // this.loader.load("/src/assets/things/Barrel.glb", (gltf) => {
    //     const barrel = gltf.scene;
    //     barrel.scale.set(5, 5, 5);
    //     barrel.position.set(2, 0, 0);
    //     this.correctColor(gltf);
    //     this.gameScene.add(barrel);
    // });

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

    public setPromiseGravity(promiseGravity: ResolvablePromise<void>) {
        this.promiseGravity = promiseGravity;
    }

    public getHeight() {
        const box = new Box3().setFromObject(this.model);
        const size = new Vector3();
        box.getSize(size);
        return size.y;
    }

    public setOnGround(onGround: boolean): void {
        this.onGround = onGround;
    }

    public isOnGround(): boolean {
        return this.onGround;
    }

    public setCanJump(canJump: boolean): void {
        this.canJump = canJump;
    }
}