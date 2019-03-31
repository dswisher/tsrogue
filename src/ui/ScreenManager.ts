
import { Rect } from "../util/Rect";
import { Screen } from "./Screen";

export class ScreenManager {
    private screens: Screen[];
    private _bounds: Rect;
    private _debug: boolean;
    private _timing: number[];

    constructor() {
        this.screens = [];
        this._debug = false;
        this._timing = [];
    }

    public push(screen: Screen): Screen {
        this.screens.push(screen);
        return screen;
    }

    public setBounds(bounds: Rect) {
        this._bounds = bounds;
        for (const screen of this.screens) {
            screen.setBounds(this._bounds);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // A fresh start
        ctx.clearRect(0, 0, this._bounds.width, this._bounds.height);

        // Draw all the screens
        for (const screen of this.screens) {
            screen.draw(ctx);
        }

        // Draw a debug overlay, if requested
        if (this.debug) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";

            ctx.strokeRect(0, 0, this._bounds.width, this._bounds.height);

            const now = performance.now();
            while (this._timing.length > 0 && this._timing[0] <= now - 1000) {
                this._timing.shift();
            }
            this._timing.push(now);
            ctx.fillText("FPS: " + this._timing.length, this._bounds.width - 60, 20);
        }
    }

    get debug(): boolean {
        return this._debug;
    }

    set debug(val: boolean) {
        this._debug = val;
    }
}
