
import { Sprite } from "./Sprite";

export class SpriteSheet {

    private image: HTMLImageElement;
    private ctx: CanvasRenderingContext2D;
    private tileSize: number;
    private sheetWidth: number;
    private names: string[];
    private spriteCache: { [name: string]: Sprite; };

    private humanSprite: Sprite;
    private haroldSprite: Sprite;

    constructor(ctx: CanvasRenderingContext2D, data: any, image: HTMLImageElement) {
        this.ctx = ctx;
        this.image = image;

        this.tileSize = data.tileSize;
        this.sheetWidth = data.width;
        this.names = data.tiles;

        console.log("-> tileSize=%d, width=%d", this.tileSize, this.sheetWidth);

        this.spriteCache = {};
    }

    public draw(offsetX: number, offsetY: number, width: number, height: number, x: number, y: number) {
        this.ctx.drawImage(this.image, offsetX, offsetY, width, height, x, y, width, height);
    }

    public getSpriteByName(name: string): Sprite {
        if (name in this.spriteCache) {
            return this.spriteCache[name];
        }

        const idx = this.names.indexOf(name);
        const row = Math.floor(idx / this.sheetWidth);
        const col = idx - (this.sheetWidth * row);
        const x = col * this.tileSize;
        const y = row * this.tileSize;

        console.log("-> name='%s', idx=%d, row=%d, col=%d, x=%d, y=%d", name, idx, row, col, x, y);

        const sprite = new Sprite(this, x, y);

        this.spriteCache[name] = sprite;

        return sprite;
    }
}
