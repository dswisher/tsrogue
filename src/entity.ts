import Component from "./components/component";

export default class Entity {
    private static count: number = 1;

    private id: string;
    private components: { [key: string]: Component; };

    constructor() {
        this.id = (+new Date()).toString(16) + Math.floor(Math.random() * 100000000).toString(16) + Entity.count;
        this.components = {};

        Entity.count += 1;
    }

    public addComponent(component: Component) {
        this.components[component.getName()] = component;
        return this;
    }

    public removeComponent(component: Component) {
        // TODO
        return this;
    }

    public print() {
        console.log(JSON.stringify(this, null, 4));
        return this;
    }
}
