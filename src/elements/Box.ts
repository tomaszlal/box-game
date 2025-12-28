import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import gsap from "gsap";
import { PromiseUtils, ResolvablePromise } from "../utils/PromiseUtils";

export class Box extends Mesh {
    private onGround!: boolean;
    private canJump: boolean = true;
    private promiseGravity: ResolvablePromise<void> = PromiseUtils.getResolvablePromise<void>();

    constructor(geometry: BoxGeometry, material: MeshStandardMaterial) {
        super(geometry, material);
        this.init();
    }

    private init() {
        this.castShadow = true;
        this.receiveShadow = true;
        this.onGround = false;
        this.promiseGravity.resolve();
    }

    public async jump(height: number = 2): Promise<void> {
        if (!this.canJump || !this.promiseGravity.resolved) {
            console.log(`dont jump   jump:${this.canJump} on ground:${this.onGround}`);
            return;
        }
        this.canJump = false;
        const tl = gsap.timeline();
        const jumpHeight = this.position.y + height;
        tl.to(this.position, {
            y: jumpHeight,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
                this.onGround = false;
            },
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

    public setCanJump(canJump: boolean): void {
        this.canJump = canJump;
    }

    public setPromiseGravity(promiseGravity: ResolvablePromise<void>): void {
        this.promiseGravity = promiseGravity;
    }
}