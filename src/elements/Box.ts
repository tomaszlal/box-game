import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial
} from "three";

export class Box extends Mesh {
    constructor(geometry: BoxGeometry, material: MeshStandardMaterial) {
        super(geometry, material);
        this.init();
    }

    private init() {
        this.castShadow = true;
        this.receiveShadow = true;
    }

    public getHeight(): number {
        return (this.geometry as BoxGeometry).parameters.height;
    }

    public getBasePositionY(): number {
        return this.position.y - this.getHeight() / 2;
    }

    public getPickPositionY(): number {
        return this.position.y + this.getHeight() / 2;
    }
}