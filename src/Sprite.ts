
import { SpriteSheet } from "./SpriteSheet";

export class Sprite {

    private spriteSheet: SpriteSheet;
    private offsetX: number;
    private offsetY: number;
    private width: number;
    private height: number;

    constructor(spriteSheet: SpriteSheet, offsetX: number, offsetY: number, width: number = 32, height: number = 32) {
        this.spriteSheet = spriteSheet;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    public draw(x: number, y: number) {
        this.spriteSheet.draw(this.offsetX, this.offsetY, this.width, this.height, x, y);
    }
}
