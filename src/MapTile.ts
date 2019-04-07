
export class MapTile {
    private _blocksMovement: boolean;
    private _blocksSight: boolean;
    private _isVisible: boolean;
    private _explored: boolean;

    constructor(blocksMovement: boolean, blocksSight: boolean = null) {

        this._blocksMovement = blocksMovement;

        if (blocksSight === null) {
            blocksSight = this._blocksMovement;
        }

        this._blocksSight = blocksSight;
    }

    public isBlocked(): boolean {
        return this._blocksMovement;
    }

    get blocksMovement() {
        return this._blocksMovement;
    }

    set blocksMovement(val: boolean) {
        this._blocksMovement = val;
    }

    get blocksSight() {
        return this._blocksSight;
    }

    set blocksSight(val: boolean) {
        this._blocksSight = val;
    }

    get isVisible() {
        return this._isVisible;
    }

    set isVisible(val: boolean) {
        this._isVisible = val;
    }

    get explored() {
        return this._explored;
    }

    set explored(val: boolean) {
        this._explored = val;
    }
}
