import gsap from "gsap";
import { Box } from "../elements/Box";
import { PromiseUtils } from '../utils/PromiseUtils';
import { KeyType } from "../types/Types";
import { singleton } from "tsyringe";

@singleton()
export class MoveController {

    private boxex: Array<Box> = [];
    private personBox!: Box;

    constructor(private groundPositionY: number) {
        this.init();
    }

    private init() {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.onKey(event);
        });
    }

    public addElementsForGravity(box: Box): void {
        this.boxex.push(box);
    }

    private async applyGravity(box: Box): Promise<void> {
        const tl = gsap.timeline();
        tl.to(box.position, {
            y: this.groundPositionY + box.getHeight() / 2,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                box.setOnGround(true);
            },
        });
    }

    private async applyGravityForPersonBox(box: Box): Promise<void> {
        const tl = gsap.timeline();
        const promiseGravity = PromiseUtils.getResolvablePromise<void>();
        box.setPromiseGravity(promiseGravity);
        tl.to(box.position, {
            y: this.groundPositionY + box.getHeight() / 2,
            duration: 0.3,
            ease: "power2.in",
            onUpdate: () => {
                if (tl.progress() > 0.95) {
                    promiseGravity.resolve();
                    box.setOnGround(true);
                    box.setCanJump(true);
                }
            },
        });
    }

    public update(): void {
        if (this.personBox && !this.personBox.isOnGround()) {
            this.applyGravityForPersonBox(this.personBox);
        }
        this.boxex.forEach((box) => {
            if (!box.isOnGround()) {
                this.applyGravity(box);
            }
        });
    }

    public getPersonBox(): Box {
        return this.personBox;
    }

    public setPersonBox(personBox: Box): void {
        this.personBox = personBox;
    }

    public onKey(e: KeyboardEvent) {
        console.log(e.code);
        switch (e.code) {
            case KeyType.BACK:

                break;
            case KeyType.RIGHT:

                break;
            case KeyType.LEFT:

                break;
            case KeyType.FORWARD:

                break;
            case KeyType.JUMP:
                this.personBox.jump();
                break;
            default:
                break;
        }
    }
}