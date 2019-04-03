
import { Point } from "./Point";

export class Rect {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get left() {
        return this._x;
    }

    get right() {
        return this._x + this._width;
    }

    get top() {
        return this._y;
    }

    get bottom() {
        return this._y + this._height;
    }

    get center() {
        const cx = Math.floor(this._x + this._width / 2);
        const cy = Math.floor(this._y + this._height / 2);
        return new Point(cx, cy);
    }

    public intersects(other: Rect): boolean {
        return this.left <= other.right && this.right >= other.left &&
               this.top <= other.bottom && this.bottom >= other.top;
    }

    public clip(bounds: Rect): Rect {
        return new Rect(Math.max(this.left, bounds.left),
                        Math.max(this.top, bounds.top),
                        Math.min(this.right, bounds.right),
                        Math.min(this.bottom, bounds.bottom));
    }
}
