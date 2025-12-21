import { WebGLRenderer } from "three";

export class GameRenderer extends WebGLRenderer {

    constructor() {
        super({ antialias: true });
        this.init();
    }

    private init() {
        this.shadowMap.enabled = true;
        this.setSize(window.innerWidth, window.innerHeight);
        this.setPixelRatio(window.devicePixelRatio);
    }
}