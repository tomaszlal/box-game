import gsap from "gsap";
import { Box } from "../elements/Box";

export class GravityController {

    private boxex: Array<Box> = [];

    constructor(private groundPositionY: number) {

    }

    public addGravity(box: Box): void {
        this.boxex.push(box);
    }

    private async applyGravity(box: Box): Promise<void> {
        const tl = gsap.timeline();
        // box.setOnJump(true);
        await tl.to(box.position, {
            y: this.groundPositionY + box.getHeight() / 2,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                box.setOnGround(true);
                box.setOnJump(false);
            }
        });
    }

    public update(): void {
        this.boxex.forEach((box) => {
            if (!box.isOnGround()) {
                this.applyGravity(box);
            }
        });
    }
}