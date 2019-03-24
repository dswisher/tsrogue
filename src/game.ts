
export default class Game {
    _ctx: CanvasRenderingContext2D;
    _canvas: HTMLCanvasElement;
    _running: boolean;
    _player_x: number;
    _player_y: number;
    _width: number;
    _height: number;
    _spriteHeight: number;
    _spriteWidth: number;
    _speed: number;
    _spriteSheet: HTMLImageElement;
    _box_x: number;     // TODO - hack to test animation speed

    constructor(canvasId: string) {
        this._running = false;
        this._player_x = 40;
        this._player_y = 40;

        this._speed = 5;
        this._box_x = 0;

        this._spriteHeight = 32;
        this._spriteWidth = 32;

        this._canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this._ctx = this._canvas.getContext("2d");

        this._resizeCanvas();

        this._spriteSheet = new Image();
        this._spriteSheet.src = 'assets/human.png';

        window.addEventListener('resize', this._resizeCanvas);

        window.addEventListener("keydown", this._handleInput);
    }

    run() {
        this._running = true;

        requestAnimationFrame(this._renderFrame);
    }

    _resizeCanvas = () => {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }

    _handleInput = (event) => {
        switch (event.keyCode) {
            case 72:    // h - move left
                if (this._player_x >= this._speed) {
                    this._player_x -= this._speed;
                }
                break;
            case 74:    // j - move down
                if (this._player_y <= this._height - this._spriteHeight - this._speed) {
                    this._player_y += this._speed;
                }
                break;
            case 75:    // k - move up
                if (this._player_y >= this._speed) {
                    this._player_y -= this._speed;
                }
                break;
            case 76:    // l - move right
                if (this._player_x <= this._width - this._spriteWidth - this._speed) {
                    this._player_x += this._speed;
                }
                break;
        }
    }

    _renderFrame = () => {
        // A fresh start
        this._ctx.clearRect(0, 0, this._width, this._height);

        // Draw everything
        var sx = 0;     // position of the sprite within the sprite sheet
        var sy = 0;

        this._ctx.drawImage(this._spriteSheet, sx, sy, this._spriteWidth, this._spriteHeight, this._player_x, this._player_y, this._spriteWidth, this._spriteHeight);

        // TODO - remove this animation "speed" test
        this._ctx.fillStyle = 'red';
        this._ctx.fillRect(this._box_x, 0, 4, 4);
        this._box_x = (this._box_x + 1) % 480;

        // Keep the loop going
        if (this._running) {
            requestAnimationFrame(this._renderFrame);
        }
    }
}

