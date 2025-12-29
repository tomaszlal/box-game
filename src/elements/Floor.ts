import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from "three";

export class Floor extends Mesh {
    
    constructor(size: number, texturePath: string) {
        const geometry = new PlaneGeometry(size, size);
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(size / 10, size / 10);

        const material = new MeshStandardMaterial({
            map: texture,
            side: DoubleSide
        });

        super(geometry, material);
        this.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
        this.position.y = 0;
        this.receiveShadow = true;
    }
}