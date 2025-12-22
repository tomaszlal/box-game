import { DirectionalLight } from "three";

export class GameDirectionalLight extends DirectionalLight {
    constructor(color: number, intensity: number) {
        super(color, intensity);
        this.init();
    }

    private init() {
        this.castShadow = true;
        this.position.set(2, 2, 2);
    }
}