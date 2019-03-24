
// From ROT.js

const FRAC = 2.3283064365386963e-10; /* 2^-32 */

class RNG {
    _seed = 0;
	_s0 = 0;
	_s1 = 0;
	_s2 = 0;
	_c = 0;

    /**
	 * Seed the number generator
	 */
	setSeed(seed: number) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * FRAC;

		seed = (seed*69069 + 1) >>> 0;
		this._s1 = seed * FRAC;

		seed = (seed*69069 + 1) >>> 0;
		this._s2 = seed * FRAC;

		this._c = 1;
		return this;
	}

    /**
	 * @returns Pseudorandom value [0,1), uniformly distributed
	 */
	getUniform() {
		let t = 2091639 * this._s0 + this._c * FRAC;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	}
}

export default new RNG().setSeed(Date.now());
