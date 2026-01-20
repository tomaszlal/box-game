import { ColorRepresentation } from "three";

export type TBox = {
    width: number;
    height: number;
    depth: number;
    color: ColorRepresentation;
}

export enum KeyType {
    FORWARD = "KeyW",
    BACK = "KeyS",
    LEFT = "KeyA",
    RIGHT = "KeyD",
    LEFT_SHIFT = "ShiftLeft",
    JUMP = "Space"
}

export type TMoveKeys = {
    [key in KeyType]?: boolean;
}

export enum CharacterAnimation {
    IDLE = 13,
    RUN = 27,
    JUMP = 20,
    WALK = 28
}