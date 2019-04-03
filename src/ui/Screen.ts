
import { Rect } from "../util/Rect";
import { Widget } from "./Widget";

export abstract class Screen {
    private widgets: Widget[];
    private _debug: boolean;

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

    get debug(): boolean {
        return this._debug;
    }

    set debug(val: boolean) {
        this._debug = val;
        for (const widget of this.widgets) {
            widget.debug = this._debug;
        }
    }

    protected addWidget(widget: Widget): void {
        this.widgets.push(widget);
    }
}
