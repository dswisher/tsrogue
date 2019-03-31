
import { Component } from "./Component";

export class PositionComponent extends Component {
    // TODO - create a Point class and use it here
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        super();

        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }
}
