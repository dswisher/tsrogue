
import { Rect } from "../util/Rect";

export abstract class Widget {
    protected bounds: Rect;
    private _debug: boolean;

    public setBounds(bounds: Rect) {
        this.bounds = bounds;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    get debug(): boolean {
        return this._debug;
    }

    set debug(val: boolean) {
        this._debug = val;
    }

    protected drawBounds(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "red";
        ctx.beginPath();

        ctx.strokeRect(this.bounds.x, this.bounds.y,
                       this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);

        ctx.moveTo(this.bounds.x, this.bounds.y);
        ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);
        ctx.moveTo(this.bounds.x, this.bounds.y + this.bounds.height);
        ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y);

        ctx.stroke();
    }
}
