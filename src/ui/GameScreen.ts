
import { DungeonMap } from "../DungeonMap";
import { EntityManager } from "../ecs/EntityManager";
import { SpriteSheet } from "../ui/SpriteSheet";
import { MapWidget } from "./MapWidget";
import { Screen } from "./Screen";

export class GameScreen extends Screen {
    private mapWidget: MapWidget;

    constructor(entityManager: EntityManager, map: DungeonMap, spriteSheet: SpriteSheet) {
        super();

        this.addWidget(new MapWidget(entityManager, map, spriteSheet));
    }
}
