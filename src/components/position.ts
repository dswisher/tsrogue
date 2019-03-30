
import Component from "./component";

export default class Position implements Component {

    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getName() {
        return "position";
    }
}
