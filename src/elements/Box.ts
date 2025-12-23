import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial
} from "three";
import gsap from "gsap";
import { TimingUtils } from "../utils/TimingUtils";

export class Box extends Mesh {

    private onGround!: boolean;
    private onJump!: boolean;
    private readonly maxJumpHeight: number = 3;
    private promiseJump: Promise<void> = Promise.resolve();

    constructor(geometry: BoxGeometry, material: MeshStandardMaterial) {
        super(geometry, material);
        this.init();
    }

    private init() {
        this.castShadow = true;
        this.receiveShadow = true;
        this.onGround = false;
        this.onJump = false;
    }

    public async jump(height: number = 2): Promise<void> {
        // console.log("try jump");
        // if (Boolean(this.promiseJump)) {
            await this.promiseJump.then(() => {
                this.onJump = true;
                console.log("kupa");
            });
        // }

        //TODO: add await on gravity landing promis from gravity controller

        if (this.onJump && !this.onGround) {
            console.log(`dont jump   jump:${this.onJump} on ground:${this.onGround}`);
            return;
        }

        this.onJump = true;
        const tl = gsap.timeline();
        const newJumpHeight = this.position.y + height > this.maxJumpHeight ? this.maxJumpHeight : this.position.y + height;
        this.promiseJump = new Promise<void>((resolve) => {
            tl.to(this.position, {
                y: newJumpHeight,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {

                    this.onGround = false;
                    resolve();
                }
            });
        });

    }

    public getHeight(): number {
        return (this.geometry as BoxGeometry).parameters.height;
    }

    public getBasePositionY(): number {
        return this.position.y - this.getHeight() / 2;
    }

    public getPickPositionY(): number {
        return this.position.y + this.getHeight() / 2;
    }

    public isOnGround(): boolean {
        return this.onGround;
    }

    public setOnGround(onGround: boolean): void {
        this.onGround = onGround;
    }


    public isOnJump(): boolean {
        return this.onJump;
    }

    public setOnJump(onJump: boolean): void {
        this.onJump = onJump;
    }
}