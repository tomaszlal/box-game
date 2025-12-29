import { Color, Scene } from "three";
import { singleton } from "tsyringe";

@singleton()
export class GameScene extends Scene {

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.background = new Color(0x001234);
    }
}