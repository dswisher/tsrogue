
// From ROT.js

const FRAC = 2.3283064365386963e-10; /* 2^-32 */

export class Random {
    private seed = 0;
    private s0 = 0;
    private s1 = 0;
    private s2 = 0;
    private c = 0;

    constructor(seed: number = null) {
        if (seed === null) {
            seed = Date.now();
        }

        this.setSeed(seed);
    }

    /**
     * Seed the number generator
     */
    public setSeed(seed: number) {
        seed = (seed < 1 ? 1 / seed : seed);

        this.seed = seed;
        // tslint:disable-next-line:no-bitwise
        this.s0 = (seed >>> 0) * FRAC;

        // tslint:disable-next-line:no-bitwise
        seed = (seed * 69069 + 1) >>> 0;
        this.s1 = seed * FRAC;

        // tslint:disable-next-line:no-bitwise
        seed = (seed * 69069 + 1) >>> 0;
        this.s2 = seed * FRAC;

        this.c = 1;
        return this;
    }

    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    public getUniform() {
        const t = 2091639 * this.s0 + this.c * FRAC;
        this.s0 = this.s1;
        this.s1 = this.s2;
        // tslint:disable-next-line:no-bitwise
        this.c = t | 0;
        this.s2 = t - this.c;
        return this.s2;
    }

    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using Random.getUniform() to distribute the value
     */
    public getUniformInt(lowerBound: number, upperBound: number) {
        const max = Math.max(lowerBound, upperBound);
        const min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
    }
}
