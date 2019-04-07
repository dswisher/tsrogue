
import { DungeonMap } from "../DungeonMap";
import { EntityManager } from "../ecs/EntityManager";
import { PositionComponent } from "../ecs/PositionComponent";
import { RenderableComponent } from "../ecs/RenderableComponent";
import { FOV } from "../fov/FOV";
import { RecursiveShadowcasting } from "../fov/RecursiveShadowcasting";
import { Sprite } from "../ui/Sprite";
import { SpriteSheet } from "../ui/SpriteSheet";
import { Point } from "../util/Point";
import { Rect } from "../util/Rect";
import { Widget } from "./Widget";

export class MapWidget extends Widget {
    private entityManager: EntityManager;
    private map: DungeonMap;
    private wall: Sprite;
    private floor: Sprite;
    private playerPosition: PositionComponent;
    private pixelBounds: Rect;
    private gridSize: Point;
    private halfGrid: Point;
    private scrollSize: Point;
    private fov: FOV;

    constructor(entityManager: EntityManager, spriteSheet: SpriteSheet, playerPosition: PositionComponent) {
        super();

        this.entityManager = entityManager;
        this.wall = spriteSheet.getSpriteByName("dngn_rock_wall_08");
        this.floor = spriteSheet.getSpriteByName("corridor");
        this.fov = new RecursiveShadowcasting((x, y) => !this.map.getTile(x, y).blocksMovement);

        // TODO - get rid of all the hard-coded "32s" in this code

        // TODO - rather than taking playerPosition as a param, have player broadcast a message?
        this.playerPosition = playerPosition;
    }

    public setBounds(bounds: Rect) {
        super.setBounds(bounds);

        this.calcBounds();
    }

    public setMap(map: DungeonMap): void {
        this.map = map;

        this.calcBounds();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.pixelBounds || !this.gridSize) {
            return;
        }

        // TODO - rather than calculating scroll bounds on every frame, do it when player position changes
        this.calcScroll();

        if (!this.scrollSize) {
            return;
        }

        // TODO - show explored areas that are not currently visible

        if (this.map) {
            // TODO - rather than calculating visibility on every frame, do it when player/mob position changes
            this.calcPlayerFOV();

            for (let sx: number = 0; sx < this.gridSize.x; sx++) {
                const gx = sx + this.scrollSize.x;
                for (let sy: number = 0; sy < this.gridSize.y; sy++) {
                    const gy = sy + this.scrollSize.y;
                    const tile = this.map.getTile(gx, gy);

                    if (tile.isVisible) {
                        const p = this.gridToPixel(new Point(gx, gy));

                        if (tile.blocksMovement) {
                            this.wall.draw(p.x, p.y);
                        } else {
                            this.floor.draw(p.x, p.y);
                        }
                    }
                }
            }
        }

        for (const entity of this.entityManager.getEntities([PositionComponent, RenderableComponent])) {
            const pos: PositionComponent = entity.getComponent(PositionComponent) as PositionComponent;
            const render: RenderableComponent = entity.getComponent(RenderableComponent) as RenderableComponent;

            // TODO - have pos return a Point
            const p = this.gridToPixel(new Point(pos.x, pos.y));

            // TODO - have draw take a Point
            render.sprite.draw(p.x, p.y);
        }
    }

    private calcBounds(): void {
        if (!this.map || !this.bounds) {
            return;
        }

        // Calc pixel bounds
        const width = Math.min(this.map.width * 32, this.bounds.width);
        const height = Math.min(this.map.height * 32, this.bounds.height);
        let left = 0;
        let top = 0;
        if (width < this.bounds.width) {
            left = (this.bounds.width - width) / 2;
        }
        if (height < this.bounds.height) {
            top = (this.bounds.height - height) / 2;
        }

        this.pixelBounds = new Rect(left, top, width, height);

        // Calc grid bounds
        this.gridSize = new Point(Math.floor(width / 32), Math.floor(height / 32));
        this.halfGrid = new Point(Math.floor(this.gridSize.x / 2), Math.floor(this.gridSize.y / 2));
    }

    private calcScroll(): void {
        const scroll = new Point(0, 0);     // we'll fill this

        if (this.playerPosition.x < this.halfGrid.x) {
            scroll.x = 0;
        } else if (this.playerPosition.x >= this.map.width - this.halfGrid.x) {
            scroll.x = this.map.width - this.gridSize.x;
        } else {
            scroll.x = this.playerPosition.x - this.halfGrid.x;
        }

        if (this.playerPosition.y < this.halfGrid.y) {
            scroll.y = 0;
        } else if (this.playerPosition.y >= this.map.height - this.halfGrid.y) {
            scroll.y = this.map.height - this.gridSize.y;
        } else {
            scroll.y = this.playerPosition.y - this.halfGrid.y;
        }

        // TODO - implement Y scrolling, too!
        this.scrollSize = scroll;
    }

    private gridToPixel(pos: Point): Point {
        const x = ((pos.x - this.scrollSize.x) * 32) + this.pixelBounds.left;
        const y = ((pos.y - this.scrollSize.y) * 32) + this.pixelBounds.top;

        return new Point(x, y);
    }

    private calcPlayerFOV(): void {
        // TODO - figure out a better way to reset the FOV each time
        for (let x: number = 0; x < this.map.width; x++) {
            for (let y: number = 0; y < this.map.height; y++) {
                this.map.getTile(x, y).isVisible = false;
            }
        }

        const radius = 10;
        this.fov.compute(this.playerPosition.x, this.playerPosition.y, radius,
                         (x, y, r, v) => { this.map.getTile(x, y).isVisible = true; });
    }
}
