
import { EntityManager } from "../ecs/EntityManager";
import { PositionComponent } from "../ecs/PositionComponent";
import { RenderableComponent } from "../ecs/RenderableComponent";
import { Widget } from "./Widget";

export class MapWidget extends Widget {
    private entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        super();

        this.entityManager = entityManager;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
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
