
export class MapTile {
    private _blocksMovement: boolean;
    private _blocksSight: boolean;

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
}
