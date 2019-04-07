// From rot.js, cleaned up to pass tslint

export type LightPassesCallback = (x: number, y: number) => boolean;

export type VisibilityCallback = (x: number, y: number, r: number, visibility: number) => void;

export abstract class FOV {
    protected _lightPasses: LightPassesCallback;

    constructor(lightPassesCallback: LightPassesCallback) {
        this._lightPasses = lightPassesCallback;
    }

    public abstract compute(x: number, y: number, r: number, callback: VisibilityCallback): void;
}
