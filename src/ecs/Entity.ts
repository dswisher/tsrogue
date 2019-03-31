
import { Component } from "./Component";
import { EntityManager } from "./EntityManager";

export class Entity {
    private manager: EntityManager;
    private components: Component[];

    constructor(manager: EntityManager) {
        this.manager = manager;
        this.components = [];
    }

    public addComponent(component: Component): Entity {
        this.components.push(component);
        return this;
    }

    public getComponent<T extends Component>(desired: T): Component {
        // TODO - icky cast; how can I do this the "right" way?
        const desiredName = (desired as any).name;

        for (const component of this.components) {
            const componentName = component.constructor.name;

            if (componentName === desiredName) {
                return component;
            }
        }

        return null;
    }
}
