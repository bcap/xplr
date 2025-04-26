import { Container, Ticker } from "pixi.js";

export class Viewport extends Container {
    update(ticker: Ticker) {
        const secs = ticker.deltaMS / 1000;
        // 1 percent per second zoom out
        const pctPerSec = 0.01;
        const factor = 1 - (pctPerSec * secs);
        this.scale.x *= factor;
        this.scale.y *= factor;
    }
}