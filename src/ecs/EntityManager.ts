
import { Component } from "./Component";
import { Entity } from "./Entity";

export class EntityManager {
    private entities: Entity[];

    constructor() {
        this.entities = [];
    }

    public createEntity(): Entity {
        const entity = new Entity(this);

        this.entities.push(entity);

        return entity;
    }

    public getEntities<T extends Component>(components: T[]): Entity[] {
        // TODO - use a generator, here

        const results = [];
        for (const entity of this.entities) {
            // TODO - test to see if entity has the desired components!
            results.push(entity);
        }

        return results;
    }
}
