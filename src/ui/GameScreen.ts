
import { DungeonMap } from "../DungeonMap";
import { EntityManager } from "../ecs/EntityManager";
import { PositionComponent } from "../ecs/PositionComponent";
import { SpriteSheet } from "../ui/SpriteSheet";
import { MapWidget } from "./MapWidget";
import { Screen } from "./Screen";

export class GameScreen extends Screen {
    private mapWidget: MapWidget;

    constructor(entityManager: EntityManager, spriteSheet: SpriteSheet, playerPosition: PositionComponent) {
        super();

        this.mapWidget = new MapWidget(entityManager, spriteSheet, playerPosition);
        this.addWidget(this.mapWidget);
    }

    public setMap(map: DungeonMap): void {
        this.mapWidget.setMap(map);
    }
}
