
import { DungeonMap } from "./DungeonMap";
import { Entity } from "./ecs/Entity";
import { EntityManager } from "./ecs/EntityManager";
import { PositionComponent } from "./ecs/PositionComponent";
import { RenderableComponent } from "./ecs/RenderableComponent";
import { SpriteSheet } from "./SpriteSheet";
import { GameScreen } from "./ui/GameScreen";
import { ScreenManager } from "./ui/ScreenManager";
import { Rect } from "./util/Rect";

export class Game {

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private running: boolean;
    private debug: boolean;
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
    private screenManager: ScreenManager;
    private entityManager: EntityManager;
    private player: Entity;
    private playerPosition: PositionComponent;

    constructor(canvasId: string) {
        this.running = false;

        this.speed = 1;

        this.debug = false;

        this.spriteHeight = 32;
        this.spriteWidth = 32;

        // TODO - use a factory to generate the map (or at least to populate it)
        this.width = 30;
        this.height = 20;
        this.map = new DungeonMap(this.width, this.height);

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.entityManager = new EntityManager();
        this.playerPosition = new PositionComponent(2, 2);

        this.screenManager = new ScreenManager();
        const gameScreen = new GameScreen(this.entityManager);
        this.screenManager.push(gameScreen);

        this.resizeCanvas();

        this.ctx.font = "15px serif";
        this.timing = [];
    }

    public run() {
        this.loadJSON("rltiles-2d.json", (data) => {
            this.loadImage("rltiles-2d.png", (image) => {
                this.running = true;

                this.spriteSheet = new SpriteSheet(this.ctx, data, image);

                this.player = this.entityManager.createEntity()
                                .addComponent(this.playerPosition)
                                .addComponent(new RenderableComponent(this.spriteSheet.getSpriteByName("sigmund")));

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
        const bounds = new Rect(0, 0, window.innerWidth, window.innerHeight);

        this.canvas.width = bounds.width;
        this.canvas.height = bounds.height;

        // TODO - change canvasWidth and canvasHeight to a Dimension object?
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        this.screenManager.setBounds(bounds);
    }

    private movePlayerTo(x: number, y: number) {
        const tile = this.map.getTile(x, y);
        if (!tile.isBlocked()) {
            this.playerPosition.x = x;
            this.playerPosition.y = y;
        }
    }

    private handleInput = (event) => {
        switch (event.keyCode) {
            case 68:    // d - for now, toggle debug
                this.debug = !this.debug;
                break;
            case 72:    // h - move left
                this.movePlayerTo(this.playerPosition.x - this.speed, this.playerPosition.y);
                break;
            case 74:    // j - move down
                this.movePlayerTo(this.playerPosition.x, this.playerPosition.y + this.speed);
                break;
            case 75:    // k - move up
                this.movePlayerTo(this.playerPosition.x, this.playerPosition.y - this.speed);
                break;
            case 76:    // l - move right
                this.movePlayerTo(this.playerPosition.x + this.speed, this.playerPosition.y);
                break;
        }
    }

    private renderFrame = () => {
        // A fresh start
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw everything
        this.screenManager.draw(this.ctx);

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

        // Draw a debug overlay, if requested
        if (this.debug) {
            this.ctx.strokeStyle = "blue";
            this.ctx.strokeRect(0, 0, this.width * this.spriteWidth, this.height * this.spriteHeight);

            this.ctx.strokeStyle = "green";
            this.ctx.fillStyle = "green";
            this.ctx.strokeRect(this.playerPosition.x * this.spriteWidth,
                                this.playerPosition.y * this.spriteHeight,
                                this.spriteWidth, this.spriteHeight);

            this.ctx.fillText("x: " + this.playerPosition.x + " y: " + this.playerPosition.y, 10, 20);

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
