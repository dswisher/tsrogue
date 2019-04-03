
import { DungeonMap } from "../DungeonMap";
import { EntityManager } from "../ecs/EntityManager";
import { PositionComponent } from "../ecs/PositionComponent";
import { RenderableComponent } from "../ecs/RenderableComponent";
import { Sprite } from "../ui/Sprite";
import { SpriteSheet } from "../ui/SpriteSheet";
import { Point } from "../util/Point";
import { Widget } from "./Widget";

export class MapWidget extends Widget {
    private entityManager: EntityManager;
    private map: DungeonMap;
    private wall: Sprite;
    private playerPosition: PositionComponent;

    constructor(entityManager: EntityManager, spriteSheet: SpriteSheet, playerPosition: PositionComponent) {
        super();

        this.entityManager = entityManager;
        this.wall = spriteSheet.getSpriteByName("dngn_rock_wall_08");

        // TODO - rather than taking playerPosition as a param, have player broadcast a message?
        this.playerPosition = playerPosition;
    }

    public setMap(map: DungeonMap): void {
        this.map = map;

        // TODO - based on the size of the map, calculate the bounds of the viewport, in pixels
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // TODO - rather than calculating bounds on every frame, do it when player position changes

        // TODO - if a cell is outside the visible bounds, don't draw it

        if (this.map) {
            for (let x: number = 0; x < this.map.width; x++) {
                for (let y: number = 0; y < this.map.height; y++) {
                    const tile = this.map.getTile(x, y);
                    if (tile.blocksMovement) {
                        const p = this.gridToPixel(new Point(x, y));

                        // TODO - have draw take a Point
                        this.wall.draw(p.x, p.y);
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

    private gridToPixel(pos: Point): Point {
        const x = (pos.x + 2) * 32;
        const y = (pos.y + 2) * 32;

        return new Point(x, y);
    }
}
