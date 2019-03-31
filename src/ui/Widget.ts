
import { Rect } from "../util/Rect";

export abstract class Widget {
    private bounds: Rect;

    public setBounds(bounds: Rect) {
        this.bounds = bounds;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

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
