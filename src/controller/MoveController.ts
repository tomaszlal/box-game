import gsap from "gsap";
import { Box } from "../elements/Box";
import { PromiseUtils } from '../utils/PromiseUtils';
import { KeyType } from "../types/Types";
import { singleton } from "tsyringe";
import { Group } from "three";

@singleton()
export class MoveController {

    private boxex: Array<Box> = [];
    private playerGroup!: Group;
    private personBox!: Box;
    private readonly moveSpeed: number = 0.2;
    private readonly sensitivity = 0.002;

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

    public setPlayerGroup(player: Group) {
        this.playerGroup = player;
        this.personBox = this.playerGroup.children[0] as Box;
        this.addMouseEventControl();
    }

    private addMouseEventControl() {
        document.body.addEventListener('click', () => {
            document.body.requestPointerLock();
        });
        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === document.body) {
                this.playerGroup.rotation.y -= event.movementX * this.sensitivity;
            }
        });
    }

    public onKey(e: KeyboardEvent) {
        console.log(e.code);
        switch (e.code) {
            case KeyType.BACK:
                this.playerGroup.translateZ(this.moveSpeed);
                break;
            case KeyType.RIGHT:
                this.playerGroup.translateX(this.moveSpeed);
                break;
            case KeyType.LEFT:
                this.playerGroup.translateX(-this.moveSpeed);
                break;
            case KeyType.FORWARD:
                this.playerGroup.translateZ(-this.moveSpeed);
                break;
            case KeyType.JUMP:
                this.personBox.jump();
                break;
            default:
                break;
        }
    }
}