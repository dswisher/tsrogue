
import Position from "./components/position";
import Renderable from "./components/renderable";
import { DungeonMap } from "./DungeonMap";
import Entity from "./entity";
import { SpriteSheet } from "./SpriteSheet";

export default class Game {
    public player: Entity;

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private running: boolean;
    private debug: boolean;
    private playerX: number;
    private playerY: number;
    private canvasWidth: number;    // the width of the canvas, in pixels
    private canvasHeight: number;   // the height of the canvas, in pixels
    private width: number;          // the width of the play area, in cells
    private height: number;         // the height of the play area, in cells
    private spriteHeight: number;
    private spriteWidth: number;
    private speed: number;
    private spriteSheet: SpriteSheet;
    private timing: number[];

    private map: DungeonMap;

    constructor(canvasId: string) {
        this.running = false;
        this.playerX = 2;
        this.playerY = 2;

        this.speed = 1;

        this.debug = false;

        this.spriteHeight = 32;
        this.spriteWidth = 32;

        // TODO - use a factory to generate the map (or at least to populate it)
        this.width = 30;
        this.height = 20;
        this.map = new DungeonMap(this.width, this.height);

        this.player = new Entity();
        this.player.addComponent(new Position(64, 64)).addComponent(new Renderable());

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.resizeCanvas();

        this.ctx.font = "15px serif";
        this.timing = [];
    }

    public run() {
        this.loadJSON("rltiles-2d.json", (data) => {
            this.loadImage("rltiles-2d.png", (image) => {
                this.running = true;

                this.spriteSheet = new SpriteSheet(this.ctx, data, image);

                window.addEventListener("resize", this.resizeCanvas);
                window.addEventListener("keydown", this.handleInput);

                requestAnimationFrame(this.renderFrame);
            });
        });

    }

    private loadImage(filename: string, callback: (image: HTMLImageElement) => void) {
        console.log("...loading sprite image...");

        const image = new Image();
        image.onload = () => {
            callback(image);
        };

        image.src = filename;
    }

    private loadJSON(filename: string, callback: (response: any) => void) {
        console.log("...loading JSON...");

        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", filename, true);
        xobj.onreadystatechange = () => {
          if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns
            //  undefined in asynchronous mode
            callback(JSON.parse(xobj.responseText));
          }
        };
        xobj.send(null);
    }

    private resizeCanvas = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    }

    private movePlayerTo(x: number, y: number) {
        const tile = this.map.getTile(x, y);
        if (!tile.isBlocked()) {
            this.playerX = x;
            this.playerY = y;
        }
    }

    private handleInput = (event) => {
        switch (event.keyCode) {
            case 68:    // d - for now, toggle debug
                this.debug = !this.debug;
                break;
            case 72:    // h - move left
                this.movePlayerTo(this.playerX - this.speed, this.playerY);
                break;
            case 74:    // j - move down
                this.movePlayerTo(this.playerX, this.playerY + this.speed);
                break;
            case 75:    // k - move up
                this.movePlayerTo(this.playerX, this.playerY - this.speed);
                break;
            case 76:    // l - move right
                this.movePlayerTo(this.playerX + this.speed, this.playerY);
                break;
        }
    }

    private renderFrame = () => {
        // A fresh start
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw everything
        const wall = this.spriteSheet.getSpriteByName("dngn_rock_wall_08");
        for (let x: number = 0; x < this.width; x++) {
            for (let y: number = 0; y < this.height; y++) {
                const tile = this.map.getTile(x, y);
                if (tile === undefined) {
                    console.log("-> tile is undefined, x=%d, y=%d", x, y);
                } else {
                    if (tile.isBlocked()) {
                        wall.draw(x * this.spriteWidth, y * this.spriteHeight);
                    }
                }
            }
        }

        this.spriteSheet.getSpriteByName("sigmund")
            .draw(this.playerX * this.spriteWidth, this.playerY * this.spriteHeight);

        // Draw a debug overlay, if requested
        if (this.debug) {
            this.ctx.strokeStyle = "blue";
            this.ctx.strokeRect(0, 0, this.width * this.spriteWidth, this.height * this.spriteHeight);

            this.ctx.strokeStyle = "green";
            this.ctx.fillStyle = "green";
            this.ctx.strokeRect(this.playerX * this.spriteWidth, this.playerY * this.spriteHeight,
                                this.spriteWidth, this.spriteHeight);

            this.ctx.fillText("x: " + this.playerX + " y: " + this.playerY, 10, 20);

            const now = performance.now();
            while (this.timing.length > 0 && this.timing[0] <= now - 1000) {
                this.timing.shift();
            }
            this.timing.push(now);
            this.ctx.fillText("FPS: " + this.timing.length, this.canvasWidth - 60, 20);
        }

        // Keep the loop going
        if (this.running) {
            requestAnimationFrame(this.renderFrame);
        }
    }
}
