
import { MapTile } from "./MapTile";
import { Point } from "./util/Point";
import { Random } from "./util/Random";
import { Rect } from "./util/Rect";

export class DungeonMap {
    private _width: number;
    private _height: number;
    private _tiles: MapTile[][];
    private _random: Random;
    private _start: Point;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._tiles = [];
        this._random = new Random();

        for (let x: number = 0; x < this._width; x++) {
            this._tiles[x] = [];
            for (let y: number = 0; y < this._height; y++) {
                this._tiles[x][y] = new MapTile(true);
            }
        }

        this.makeMap();
    }

    public getTile(x: number, y: number): MapTile {
        return this._tiles[x][y];
    }

    get start() {
        return this._start;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    private makeMap() {
        const minRoomSize = 6;
        const maxRoomSize = 10;
        const maxRooms = 30;
        const rooms = [];

        for (let i = 0; i < 5 * maxRooms; i++) {
            const w = this._random.getUniformInt(minRoomSize, maxRoomSize);
            const h = this._random.getUniformInt(minRoomSize, maxRoomSize);

            const x = this._random.getUniformInt(0, this._width - w - 1);
            const y = this._random.getUniformInt(0, this._height - h - 1);

            const newRoom = new Rect(x, y, w, h);

            let overlaps = false;
            for (const room of rooms) {
                if (newRoom.intersects(room)) {
                    overlaps = true;
                }
            }

            if (!overlaps) {
                this.createRoom(newRoom);

                const newCenter = newRoom.center;

                if (rooms.length === 0) {
                    this._start = newCenter;
                } else {
                    const prevCenter = rooms[rooms.length - 1].center;

                    if (this._random.getUniform() > 0.5) {
                        // horizontal, then vertical
                        this.createHorizontalTunnel(prevCenter.x, newCenter.x, prevCenter.y);
                        this.createVerticalTunnel(prevCenter.y, newCenter.y, newCenter.x);
                    } else {
                        // vertical, then horizontal
                        this.createVerticalTunnel(prevCenter.y, newCenter.y, prevCenter.x);
                        this.createHorizontalTunnel(prevCenter.x, newCenter.x, newCenter.y);
                    }
                }

                rooms.push(newRoom);
            }

            if (rooms.length >= maxRooms) {
                break;
            }
        }
    }

    private createHorizontalTunnel(x1: number, x2: number, y: number) {
        for (let x: number = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            this.dig(x, y);
        }
    }

    private createVerticalTunnel(y1: number, y2: number, x: number) {
        for (let y: number = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            this.dig(x, y);
        }
    }

    private createRoom(room: Rect): void {
        for (let x = 1; x < room.width; x++) {
            for (let y = 1; y < room.height; y++) {
                this.dig(x + room.x, y + room.y);
            }
        }
    }

    private dig(x: number, y: number) {
        const tile = this._tiles[x][y];
        tile.blocksMovement = false;
        tile.blocksSight = false;
    }
}
