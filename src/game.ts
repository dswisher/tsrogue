
import Position from "./components/position";
import Renderable from "./components/renderable";
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
    private width: number;
    private height: number;
    private spriteHeight: number;
    private spriteWidth: number;
    private speed: number;
    private spriteSheet: SpriteSheet;
    private timing: number[];

    constructor(canvasId: string) {
        this.running = false;
        this.playerX = 64;
        this.playerY = 64;

        this.speed = 32;

        this.debug = false;

        this.spriteHeight = 32;
        this.spriteWidth = 32;

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

        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    private handleInput = (event) => {
        switch (event.keyCode) {
            case 68:    // d - for now, toggle debug
                this.debug = !this.debug;
                break;
            case 72:    // h - move left
                if (this.playerX >= this.speed) {
                    this.playerX -= this.speed;
                }
                break;
            case 74:    // j - move down
                if (this.playerY <= this.height - this.spriteHeight - this.speed) {
                    this.playerY += this.speed;
                }
                break;
            case 75:    // k - move up
                if (this.playerY >= this.speed) {
                    this.playerY -= this.speed;
                }
                break;
            case 76:    // l - move right
                if (this.playerX <= this.width - this.spriteWidth - this.speed) {
                    this.playerX += this.speed;
                }
                break;
        }
    }

    private renderFrame = () => {
        // A fresh start
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw some debug bits
        if (this.debug) {
            this.ctx.strokeStyle = "green";
            this.ctx.fillStyle = "green";
            this.ctx.strokeRect(this.playerX, this.playerY, this.spriteWidth, this.spriteHeight);

            const now = performance.now();
            while (this.timing.length > 0 && this.timing[0] <= now - 1000) {
                this.timing.shift();
            }
            this.timing.push(now);
            this.ctx.fillText("FPS: " + this.timing.length, this.width - 60, 20);
        }

        // Draw everything
        this.spriteSheet.getSpriteByName("sigmund").draw(this.playerX, this.playerY);

        // Keep the loop going
        if (this.running) {
            requestAnimationFrame(this.renderFrame);
        }
    }
}
