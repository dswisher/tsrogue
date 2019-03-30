
// From ROT.js

const FRAC = 2.3283064365386963e-10; /* 2^-32 */

class RNG {
    private seed = 0;
    private s0 = 0;
    private s1 = 0;
    private s2 = 0;
    private c = 0;

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
}

export default new RNG().setSeed(Date.now());
