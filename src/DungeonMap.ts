
import { MapTile } from "./MapTile.ts";

export class DungeonMap {
    private width: number;
    private height: number;
    private tiles: MapTile[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];

        for (let x: number = 0; x < this.width; x++) {
            this.tiles[x] = [];
            for (let y: number = 0; y < this.height; y++) {
                const edge = (x === 0) || (y === 0) || (x === this.width - 1) || (y === this.height - 1);
                this.tiles[x][y] = new MapTile(edge);
            }
        }
    }

    public getTile(x: number, y: number): MapTile {
        return this.tiles[x][y];
    }
}
