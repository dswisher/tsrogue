
import Component from "./component";

export default class Position implements Component {

    _x: number;
    _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    getName() {
        return "position";
    }
}

