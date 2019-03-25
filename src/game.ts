
import Entity from './entity';
import Position from './components/position';
import Renderable from './components/renderable';

export default class Game {
    _ctx: CanvasRenderingContext2D;
    _canvas: HTMLCanvasElement;
    _running: boolean;
    _debug: boolean;
    _player_x: number;
    _player_y: number;
    _width: number;
    _height: number;
    _spriteHeight: number;
    _spriteWidth: number;
    _speed: number;
    _spriteSheet: HTMLImageElement;
    _timing: Array<number>;

    player: Entity;

    constructor(canvasId: string) {
        this._running = false;
        this._player_x = 64;
        this._player_y = 64;

        this._speed = 32;

        this._debug = false;

        this._spriteHeight = 32;
        this._spriteWidth = 32;

        this.player = new Entity();
        this.player.addComponent(new Position(64, 64)).addComponent(new Renderable());

        this._canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this._ctx = this._canvas.getContext("2d");

        this._resizeCanvas();

        this._spriteSheet = new Image();
        this._spriteSheet.src = 'human.png';

        this._ctx.font = '15px serif';
        this._timing = [];

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
            case 68:    // d - for now, toggle debug
                this._debug = !this._debug;
                break;
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

        // Draw some debug bits
        if (this._debug) {
            this._ctx.strokeStyle = 'green';
            this._ctx.fillStyle = 'green';
            this._ctx.strokeRect(this._player_x, this._player_y, this._spriteWidth, this._spriteHeight);

            const now = performance.now();
            while (this._timing.length > 0 && this._timing[0] <= now - 1000) {
                this._timing.shift();
            }
            this._timing.push(now);
            this._ctx.fillText("FPS: " + this._timing.length, this._width - 60, 20);
        }

        // Draw everything
        var sx = 0;     // position of the sprite within the sprite sheet
        var sy = 0;

        this._ctx.drawImage(this._spriteSheet, sx, sy, this._spriteWidth, this._spriteHeight, this._player_x, this._player_y, this._spriteWidth, this._spriteHeight);

        // Keep the loop going
        if (this._running) {
            requestAnimationFrame(this._renderFrame);
        }
    }
}

