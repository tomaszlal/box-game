import { DirectionalLight } from "three";

export class GameDirectionalLight extends DirectionalLight {
    constructor(color: number, intensity: number) {
        super(color, intensity);
        this.init();
    }

    private init() {
        this.castShadow = true;
        this.position.set(2, 10, 2);
        this.shadow.camera.left = -50;
        this.shadow.camera.right = 50;
        this.shadow.camera.top = 50;
        this.shadow.camera.bottom = -50;
        this.shadow.camera.near = 1;
        this.shadow.camera.far = 500;
        this.shadow.mapSize.width = 2048;
        this.shadow.mapSize.height = 2048;
    }
}