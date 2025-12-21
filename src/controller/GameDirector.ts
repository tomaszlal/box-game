import type { Scene, WebGLRenderer } from "three";

export class GameDirector {
    private scene: Scene;
    private renderer: WebGLRenderer;

    constructor(
        scene: Scene,
        renderer: WebGLRenderer
    ) {
        this.scene = scene;
        this.renderer = renderer;
    }
}