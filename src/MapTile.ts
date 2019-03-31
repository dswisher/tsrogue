
export class MapTile {
    private blocksMovement: boolean;
    private blocksSight: boolean;

    constructor(blocksMovement: boolean, blocksSight: boolean = null) {

        this.blocksMovement = blocksMovement;

        if (blocksSight === null) {
            blocksSight = this.blocksMovement;
        }

        this.blocksSight = blocksSight;
    }

    public isBlocked(): boolean {
        return this.blocksMovement;
    }
}
