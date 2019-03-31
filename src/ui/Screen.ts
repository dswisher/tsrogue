
import { Rect } from "../util/Rect";
import { Widget } from "./Widget";

export abstract class Screen {
    private widgets: Widget[];

    constructor() {
        this.widgets = [];
    }

    public setBounds(bounds: Rect) {
        // TODO - do some sort of dynamic layout; for now, just handle a single widget
        for (const widget of this.widgets) {
            widget.setBounds(bounds);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const widget of this.widgets) {
            widget.draw(ctx);
        }
    }

    protected addWidget(widget: Widget): void {
        this.widgets.push(widget);
    }
}
