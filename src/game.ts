
import Position from "./components/position";
import Renderable from "./components/renderable";
import Entity from "./entity";

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
    private spriteSheet: HTMLImageElement;
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

        this.spriteSheet = new Image();
        this.spriteSheet.src = "human.png";

        this.ctx.font = "15px serif";
        this.timing = [];

        window.addEventListener("resize", this.resizeCanvas);

        window.addEventListener("keydown", this.handleInput);
    }

    public run() {
        this.running = true;

        requestAnimationFrame(this.renderFrame);
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
        const sx = 0;     // position of the sprite within the sprite sheet
        const sy = 0;

        this.ctx.drawImage(this.spriteSheet, sx, sy, this.spriteWidth, this.spriteHeight,
                           this.playerX, this.playerY, this.spriteWidth, this.spriteHeight);

        // Keep the loop going
        if (this.running) {
            requestAnimationFrame(this.renderFrame);
        }
    }
}
