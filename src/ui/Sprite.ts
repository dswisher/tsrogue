
import { SpriteSheet } from "./SpriteSheet";

export class Sprite {

    private spriteSheet: SpriteSheet;
    private offsetX: number;
    private offsetY: number;
    private _width: number;
    private _height: number;

    constructor(spriteSheet: SpriteSheet, offsetX: number, offsetY: number, width: number = 32, height: number = 32) {
        this.spriteSheet = spriteSheet;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this._width = width;
        this._height = height;
    }

    public draw(x: number, y: number) {
        this.spriteSheet.draw(this.offsetX, this.offsetY, this._width, this._height, x, y);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }
}
