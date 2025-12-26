import { ColorRepresentation } from "three";

export type TBox = {
    width: number;
    height: number;
    depth: number;
    color: ColorRepresentation;
}

export enum KeyType{
    FORWARD = "KeyW",
    BACK = "KeyS",
    LEFT = "KeyA",
    RIGHT = "KeyD",
    JUMP = "Space"
}