import { DEG_TO_RAD, Graphics, Ticker, Point } from "pixi.js";
import { PhysicalObject } from "./physobject";
import Keyboard from "pixi.js-keyboard";
import { loadSVGAsset } from "./loader";

export class SpaceShip extends PhysicalObject {
    private _body = new Graphics();
    private _thrust = 0;
    private _thrustVector = new Point();

    async draw() {
        this._body = await loadSVGAsset('./assets/spaceship.svg')
        this.addChild(this._body);
    }

    get thrust(): number {
        return this._thrust;
    }

    get thrustVector(): Point {
        return this._thrustVector.clone();
    }

    update(ticker: Ticker) {
        const secs = ticker.deltaMS / 1000;

        if (Keyboard.isKeyDown('ArrowLeft', 'KeyA')) {
            this.angularAcceleration -= 60 * DEG_TO_RAD * secs;
        } else if (Keyboard.isKeyDown('ArrowRight', 'KeyD')) {
            this.angularAcceleration += 60 * DEG_TO_RAD * secs;
        } else {
            this.angularAcceleration = 0;
        }

        if (this.angularAcceleration / DEG_TO_RAD > 60) {
            this.angularAcceleration = 60 * DEG_TO_RAD
        } else if (this.angularAcceleration / DEG_TO_RAD < -60) {
            this.angularAcceleration = -60 * DEG_TO_RAD;
        }

        if (Keyboard.isKeyDown('ArrowUp', 'KeyW')){
            if (this.thrust < 1000) {
                this._thrust = Math.min(1000, this._thrust + 200 * secs);
            }
        } else {
            this._thrust = 0;
            this._thrustVector.set(0, 0);
        }

        if (Keyboard.isKeyDown('KeyX')) {
            this.zeroMomentum()
        }

        if (this.thrust > 0) {
            const t = this.thrust * secs;
            this._thrustVector.x = Math.sin(this.rotation) * t;
            this._thrustVector.y = -Math.cos(this.rotation) * t;

            this.acceleration.x = this._thrustVector.x;
            this.acceleration.y = this._thrustVector.y;
        }

        super.update(ticker);
    }
}

