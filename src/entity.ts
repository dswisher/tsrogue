import Component from "./components/component"

export default class Entity {
    static _count: number = 1;

    _id: string;
    _components: { [key: string]: Component; }

    constructor() {
        this._id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity._count;
        this._components = {}

        Entity._count += 1;
    }

    addComponent(component: Component) {
        this._components[component.getName()] = component;
        return this;
    }

    removeComponent(component: Component) {
        // TODO
        return this;
    }

    print() {
        console.log(JSON.stringify(this, null, 4));
        return this;
    }
}

