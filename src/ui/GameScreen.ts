
import { EntityManager } from "../ecs/EntityManager";
import { MapWidget } from "./MapWidget.ts";
import { Screen } from "./Screen.ts";

export class GameScreen extends Screen {
    private mapWidget: MapWidget;

    constructor(entityManager: EntityManager) {
        super();

        this.addWidget(new MapWidget(entityManager));
    }
}
