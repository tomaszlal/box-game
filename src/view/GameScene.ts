import { Color, Scene } from "three";

export class GameScene extends Scene {

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.background = new Color(0x001234);
    }
}