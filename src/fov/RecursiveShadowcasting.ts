// From rot.js, cleaned up to pass tslint
// https://github.com/ondras/rot.js/blob/master/src/fov/recursive-shadowcasting.ts

import { FOV, VisibilityCallback } from "./FOV";

export class RecursiveShadowcasting extends FOV {

    // Octants used for translating recursive shadowcasting offsets
    private OCTANTS = [
        [-1,  0,  0,  1],
        [ 0, -1,  1,  0],
        [ 0, -1, -1,  0],
        [-1,  0,  0, -1],
        [ 1,  0,  0, -1],
        [ 0,  1, -1,  0],
        [ 0,  1,  1,  0],
        [ 1,  0,  0,  1],
    ];

    public compute(x: number, y: number, r: number, callback: VisibilityCallback): void {
        // You can always see your own tile
        callback(x, y, 0, 1);

        for (const octant of this.OCTANTS) {
            this._renderOctant(x, y, octant, r, callback);
        }
    }

    private _renderOctant(x: number, y: number, octant: number[], r: number, callback: VisibilityCallback) {
        // Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
        this._castVisibility(x, y, 1, 1.0, 0.0, r + 1, octant[0], octant[1], octant[2], octant[3], callback);
    }

    private _castVisibility(startX: number, startY: number, row: number, visSlopeStart: number, visSlopeEnd: number,
                            radius: number, xx: number, xy: number, yx: number, yy: number,
                            callback: VisibilityCallback) {
        if (visSlopeStart < visSlopeEnd) { return; }
        for (let i = row; i <= radius; i++) {
            let dx = -i - 1;
            const dy = -i;
            let blocked = false;
            let newStart = 0;

            // 'Row' could be column, names here assume octant 0 and would be flipped for half the octants
            while (dx <= 0) {
                dx += 1;

                // Translate from relative coordinates to map coordinates
                const mapX = startX + dx * xx + dy * xy;
                const mapY = startY + dx * yx + dy * yy;

                // Range of the row
                const slopeStart = (dx - 0.5) / (dy + 0.5);
                const slopeEnd = (dx + 0.5) / (dy - 0.5);

                // Ignore if not yet at left edge of Octant
                if (slopeEnd > visSlopeStart) { continue; }

                // Done if past right edge
                if (slopeStart < visSlopeEnd) { break; }

                // If it's in range, it's visible
                if ((dx * dx + dy * dy) < (radius * radius)) {
                    callback(mapX, mapY, i, 1);
                }

                if (!blocked) {
                    // If tile is a blocking tile, cast around it
                    if (!this._lightPasses(mapX, mapY) && i < radius) {
                        blocked = true;
                        this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius,
                                             xx, xy, yx, yy, callback);
                        newStart = slopeEnd;
                    }
                } else {
                    // Keep narrowing if scanning across a block
                    if (!this._lightPasses(mapX, mapY)) {
                        newStart = slopeEnd;
                        continue;
                    }

                    // Block has ended
                    blocked = false;
                    visSlopeStart = newStart;
                }
            }

            if (blocked) { break; }
        }
    }
}
