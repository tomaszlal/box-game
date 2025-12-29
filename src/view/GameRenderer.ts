import { WebGLRenderer } from "three";
import { singleton } from "tsyringe";

@singleton()
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