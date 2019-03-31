
import { Sprite } from "../ui/Sprite";
import { Component } from "./Component";

export class RenderableComponent extends Component {
    private _sprite: Sprite;

    constructor(sprite: Sprite) {
        super();

        this._sprite = sprite;
    }

    get sprite(): Sprite {
        return this._sprite;
    }
}
