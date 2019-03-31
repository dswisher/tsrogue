
import { Rect } from "../util/Rect";
import { Screen } from "./Screen";

export class ScreenManager {
    private screens: Screen[];

    constructor() {
        this.screens = [];
    }

    public push(screen: Screen): Screen {
        this.screens.push(screen);
        return screen;
    }

    public setBounds(bounds: Rect) {
        for (const screen of this.screens) {
            screen.setBounds(bounds);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const screen of this.screens) {
            screen.draw(ctx);
        }
    }
}
