
import { DungeonMap } from "../DungeonMap";
import { EntityManager } from "../ecs/EntityManager";
import { PositionComponent } from "../ecs/PositionComponent";
import { RenderableComponent } from "../ecs/RenderableComponent";
import { Sprite } from "../ui/Sprite";
import { SpriteSheet } from "../ui/SpriteSheet";
import { Widget } from "./Widget";

export class MapWidget extends Widget {
    private entityManager: EntityManager;
    private map: DungeonMap;
    private wall: Sprite;

    constructor(entityManager: EntityManager, map: DungeonMap, spriteSheet: SpriteSheet) {
        super();

        this.entityManager = entityManager;
        this.map = map;
        this.wall = spriteSheet.getSpriteByName("dngn_rock_wall_08");
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (let x: number = 0; x < this.map.width; x++) {
            for (let y: number = 0; y < this.map.height; y++) {
                const tile = this.map.getTile(x, y);
                if (tile.blocksMovement) {
                    this.wall.draw(x * this.wall.width, y * this.wall.height);
                }
            }
        }

        for (const entity of this.entityManager.getEntities([PositionComponent, RenderableComponent])) {
            const pos: PositionComponent = entity.getComponent(PositionComponent) as PositionComponent;
            const render: RenderableComponent = entity.getComponent(RenderableComponent) as RenderableComponent;

            // TODO - icky - need to know the grid size here!
            const x = pos.x * render.sprite.width;
            const y = pos.y * render.sprite.height;

            render.sprite.draw(x, y);
        }
    }
}
