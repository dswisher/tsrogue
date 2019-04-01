
import { DungeonMap } from "./DungeonMap";
import { Entity } from "./ecs/Entity";
import { EntityManager } from "./ecs/EntityManager";
import { PositionComponent } from "./ecs/PositionComponent";
import { RenderableComponent } from "./ecs/RenderableComponent";
import { GameScreen } from "./ui/GameScreen";
import { ScreenManager } from "./ui/ScreenManager";
import { SpriteSheet } from "./ui/SpriteSheet";
import { Rect } from "./util/Rect";

export class Game {

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private running: boolean;
    private width: number;          // the width of the play area, in cells
    private height: number;         // the height of the play area, in cells
    private spriteHeight: number;
    private spriteWidth: number;
    private spriteSheet: SpriteSheet;

    private map: DungeonMap;
    private screenManager: ScreenManager;
    private entityManager: EntityManager;
    private player: Entity;
    private playerPosition: PositionComponent;

    constructor(canvasId: string) {
        this.running = false;

        this.spriteHeight = 32;
        this.spriteWidth = 32;

        // TODO - use a factory to generate the map (or at least to populate it)
        this.width = 40;
        this.height = 20;
        this.map = new DungeonMap(this.width, this.height);

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.entityManager = new EntityManager();
        this.playerPosition = new PositionComponent(this.map.start.x, this.map.start.y);

        this.screenManager = new ScreenManager();
        const gameScreen = new GameScreen(this.entityManager);
        this.screenManager.push(gameScreen);

        this.resizeCanvas();

        this.ctx.font = "15px serif";
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

        this.screenManager.setBounds(bounds);
    }

    private movePlayerTo(x: number, y: number) {
        const tile = this.map.getTile(x, y);
        if (!tile.blocksMovement) {
            this.playerPosition.x = x;
            this.playerPosition.y = y;
        }
    }

    private handleInput = (event) => {
        switch (event.keyCode) {
            case 68:    // d - for now, toggle debug
                this.screenManager.debug = !this.screenManager.debug;
                break;
            case 72:    // h - move left
                this.movePlayerTo(this.playerPosition.x - 1, this.playerPosition.y);
                break;
            case 74:    // j - move down
                this.movePlayerTo(this.playerPosition.x, this.playerPosition.y + 1);
                break;
            case 75:    // k - move up
                this.movePlayerTo(this.playerPosition.x, this.playerPosition.y - 1);
                break;
            case 76:    // l - move right
                this.movePlayerTo(this.playerPosition.x + 1, this.playerPosition.y);
                break;
        }
    }

    private renderFrame = () => {
        // Draw everything
        this.screenManager.draw(this.ctx);

        // TODO - move this to map widget!
        const wall = this.spriteSheet.getSpriteByName("dngn_rock_wall_08");
        for (let x: number = 0; x < this.width; x++) {
            for (let y: number = 0; y < this.height; y++) {
                const tile = this.map.getTile(x, y);
                if (tile === undefined) {
                    console.log("-> tile is undefined, x=%d, y=%d", x, y);
                } else {
                    if (tile.blocksMovement) {
                        wall.draw(x * this.spriteWidth, y * this.spriteHeight);
                    }
                }
            }
        }

        // Keep the loop going
        if (this.running) {
            requestAnimationFrame(this.renderFrame);
        }
    }
}
