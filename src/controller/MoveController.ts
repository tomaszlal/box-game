import gsap from "gsap";
import { Box } from "../elements/Box";
import { PromiseUtils } from '../utils/PromiseUtils';
import { KeyType, TMoveKeys } from "../types/Types";
import { singleton } from "tsyringe";
import { Group } from "three";
import { Character } from '../elements/Character';

@singleton()
export class MoveController {

    private boxex: Array<Box> = [];
    private playerGroup!: Group;
    private player!: Group;
    private character!: Character;
    private readonly moveSpeed: number = 0.05;
    private readonly sensitivity = 0.002;
    private readonly moveKeys: TMoveKeys = {
        [KeyType.FORWARD]: false,
        [KeyType.BACK]: false,
        [KeyType.LEFT]: false,
        [KeyType.RIGHT]: false
    };

    constructor(private groundPositionY: number) {
        this.init();
    }

    private init() {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.onKey(event);
        });
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.moveKeys[event.code as KeyType] = true;
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.moveKeys[event.code as KeyType] = false;
        });
    }

    public addElementsForGravity(box: Box): void {
        this.boxex.push(box);
    }

    private async applyGravity(box: Box): Promise<void> {
        const tl = gsap.timeline();
        tl.to(box.position, {
            y: this.groundPositionY + box.getHeight() / 2,
            duration: 0.25,
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
            duration: 0.25,
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

    private async applyGravityForPerson(player: Character): Promise<void> {
        const tl = gsap.timeline();
        const promiseGravity = PromiseUtils.getResolvablePromise<void>();
        player.setPromiseGravity(promiseGravity);
        tl.to(player.model.position, {
            y: this.groundPositionY,
            duration: 0.25,
            ease: "power2.in",
            onUpdate: () => {
                if (tl.progress() > 0.95) {
                    promiseGravity.resolve();
                    player.setOnGround(true);
                    player.setCanJump(true);
                }
            },
        });
    }

    public update(): void {
        if (this.character && !this.character.isOnGround()) {
            this.applyGravityForPerson(this.character);
        }
        this.boxex.forEach((box) => {
            if (!box.isOnGround()) {
                this.applyGravity(box);
            }
        });
        this.keysListener();
    }

    private keysListener() {
        switch (true) {
            case this.moveKeys[KeyType.FORWARD] === true:
                this.playerGroup.translateZ(-this.moveSpeed);
                break;
            case this.moveKeys[KeyType.BACK] === true:
                this.playerGroup.translateZ(this.moveSpeed);
                break;
            case this.moveKeys[KeyType.LEFT] === true:
                this.playerGroup.translateX(-this.moveSpeed);
                break;
            case this.moveKeys[KeyType.RIGHT] === true:
                this.playerGroup.translateX(this.moveSpeed);
                break;
            default:
                break;
        }
    }

    public setPlayerCharacter(playerGroup: Group, character: Character) {
        this.playerGroup = playerGroup;
        this.character = character;
        this.player = character.model;
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
            case KeyType.JUMP:
                this.character.jump();
                break;
            default:
                break;
        }
    }
}