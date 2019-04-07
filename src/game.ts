
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

    private map: DungeonMap;
    private screenManager: ScreenManager;
    private entityManager: EntityManager;
    private player: Entity;
    private playerPosition: PositionComponent;
    private gameScreen: GameScreen;

    constructor(canvasId: string) {
        this.running = false;

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.entityManager = new EntityManager();

        this.ctx.font = "15px serif";
    }

    public run() {
        this.loadJSON("rltiles-2d.json", (data) => {
            this.loadImage("rltiles-2d.png", (image) => {
                this.running = true;

                const spriteSheet = new SpriteSheet(this.ctx, data, image);

                this.playerPosition = new PositionComponent(0, 0);  // will be adjusted when map is created
                this.screenManager = new ScreenManager();
                this.gameScreen = new GameScreen(this.entityManager, spriteSheet, this.playerPosition);
                this.screenManager.push(this.gameScreen);

                this.resizeCanvas();

                this.player = this.entityManager.createEntity()
                                .addComponent(this.playerPosition)
                                .addComponent(new RenderableComponent(spriteSheet.getSpriteByName("sigmund")));

                this.createMap();

                window.addEventListener("resize", this.resizeCanvas);
                window.addEventListener("keydown", this.handleInput);

                requestAnimationFrame(this.renderFrame);
            });
        });

    }

    private createMap(width: number = 40, height: number = 20): void {

        // TODO - use a factory class to generate the map, so we can have different algos
        this.map = new DungeonMap(width, height);

        // TODO - playerPosition should be a Point
        this.playerPosition.x = this.map.start.x;
        this.playerPosition.y = this.map.start.y;

        this.gameScreen.setMap(this.map);
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

    private movePlayerTo(dx: number, dy: number) {
        const x = this.playerPosition.x + dx;
        const y = this.playerPosition.y + dy;

        const tile = this.map.getTile(x, y);
        if (!tile.blocksMovement) {
            this.playerPosition.x = x;
            this.playerPosition.y = y;
        }
    }

    private handleInput = (event) => {
        switch (event.keyCode) {
            case 49:    // 1 - generate small map
                this.createMap(36, 18);
                break;
            case 50:    // 2 - generate medium map
                this.createMap(50, 25);
                break;
            case 51:    // 3 - generate large map
                this.createMap(100, 50);
                break;

            case 68:    // d - for now, toggle debug
                this.screenManager.debug = !this.screenManager.debug;
                break;

            case 66:    // b - move down and left
                this.movePlayerTo(-1, 1);
                break;
            case 72:    // h - move left
                this.movePlayerTo(-1, 0);
                break;
            case 74:    // j - move down
                this.movePlayerTo(0, 1);
                break;
            case 75:    // k - move up
                this.movePlayerTo(0, -1);
                break;
            case 76:    // l - move right
                this.movePlayerTo(1, 0);
                break;
            case 78:    // n - move down and right
                this.movePlayerTo(1, 1);
                break;
            case 85:    // u - move up and right
                this.movePlayerTo(1, -1);
                break;
            case 89:    // y - move up and left
                this.movePlayerTo(-1, -1);
                break;

            // default:
            //     console.log("-> unhandled key, keycode=%d", event.keyCode);
            //     break;
        }
    }

    private renderFrame = () => {
        // Draw everything
        this.screenManager.draw(this.ctx);

        // Keep the loop going
        if (this.running) {
            requestAnimationFrame(this.renderFrame);
        }
    }
}
