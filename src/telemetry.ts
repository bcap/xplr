import { Container, Ticker, Text, TextStyle, RAD_TO_DEG } from "pixi.js";
import { round } from "./math";
import { SpaceShip } from "./spaceship";

export class Telemetry extends Container {
    refreshRate: number;
    private _lastUpdate: number = 0;
    private _startedAt?: Date;
    private _minFps: number = -1;
    private _maxFps: number = -1;
    private _spaceShip: SpaceShip;
    private _text: Text;
    private _accumulatedTime: number = 0;

    constructor(spaceShip: SpaceShip, refreshRate: number = 10) {
        super();
        this._spaceShip = spaceShip;
        this.refreshRate = refreshRate;
        const style = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 10,
            fill: 0xFFFFFF,
            align: 'left',
            lineHeight: 15,
        });
        this._text = new Text({ style: style });
    }

    draw() {
        this._text.x = 10;
        this._text.y = 10;
        this.updateText();
        this.addChild(this._text);
    }

    update(ticker: Ticker) {
        this._accumulatedTime += ticker.deltaMS / 1000;

        this.measureFps(ticker);

        this._lastUpdate += ticker.deltaMS;
        if (this._lastUpdate < 1000 / this.refreshRate) {
            return;
        }
        this._lastUpdate = 0;

        this.updateText(ticker);
    }

    measureFps(ticker: Ticker) {
        if (this._minFps === -1) {
            if (!this._startedAt) {
                this._startedAt = new Date();
            }
            const now = new Date();
            const elapsedMs = now.getTime() - this._startedAt.getTime();
            // wait 1 second to start measuring min and max fps
            if (elapsedMs > 1000) {
                this._maxFps = ticker.FPS;
                this._minFps = ticker.FPS;
            }
            return;
        }
        if (ticker.FPS > this._maxFps) {
            this._maxFps = ticker.FPS;
        }
        if (ticker.FPS < this._minFps) {
            this._minFps = ticker.FPS;
        }
    }

    updateText(ticker?: Ticker) {
        const accumulatedTime = round(this._accumulatedTime, 1);
        let accumulatedTimeStr = accumulatedTime.toString() + 's';
        if (accumulatedTime > 60) {
            const minutes = Math.floor(accumulatedTime / 60);
            const seconds = accumulatedTime % 60;
            accumulatedTimeStr = `${minutes}m ${round(seconds)}s`;
        }

        let fps = 0;
        if (ticker) {
            fps = round(ticker.FPS);
        }
        const minFps = round(this._minFps);
        const maxFps = round(this._maxFps);

        const x = round(this._spaceShip.x).toString().padEnd(6);
        const y = round(this._spaceShip.y).toString().padEnd(6);
        const positionAngle = vectorAngleDegrees(this._spaceShip.x, this._spaceShip.y);
        const positionArrow = angleToArrow(positionAngle);

        const velocityX = round(this._spaceShip.velocity.x, 2).toString().padEnd(6);
        const velocityY = round(this._spaceShip.velocity.y, 2).toString().padEnd(6);
        const velocityAngle = round(vectorAngleDegrees(this._spaceShip.velocity.x, this._spaceShip.velocity.y), 2);
        const velocityArrow = angleToArrow(velocityAngle);

        const speed = round(this._spaceShip.speed, 2).toString().padEnd(6)

        const thrust = round(this._spaceShip.thrust, 2).toString().padEnd(6);
        const thrustVectorX = round(this._spaceShip.thrustVector.x, 2).toString().padEnd(6);
        const thrustVectorY = round(this._spaceShip.thrustVector.y, 2).toString().padEnd(6);

        const acceleration = round(
            Math.sqrt(
                Math.pow(this._spaceShip.acceleration.x, 2) +
                Math.pow(this._spaceShip.acceleration.y, 2)
            ) , 2
        ).toString().padEnd(6);
        const accelVectorX = round(this._spaceShip.acceleration.x, 2).toString().padEnd(6);
        const accelVectorY = round(this._spaceShip.acceleration.y, 2).toString().padEnd(6);
        const accelarationAngle = round(vectorAngleDegrees(this._spaceShip.acceleration.x, this._spaceShip.acceleration.y), 2);
        const accelerationArrow = angleToArrow(accelarationAngle);

        const rotationDeg = round(angleDegrees(this._spaceShip.rotation), 2);
        const rotationDegStr = rotationDeg.toString().padEnd(6);
        const rotationArrow = angleToArrow(rotationDeg);

        const angularSpeedDeg = round(this._spaceShip.angularSpeed * RAD_TO_DEG, 2).toString().padEnd(6);
        const angularAccelerationDeg = round(this._spaceShip.angularAcceleration * RAD_TO_DEG, 2).toString().padEnd(6);

        this._text.text =
            `simulation time:      ${accumulatedTimeStr}\n` +
            `fps:                  ${fps} (${minFps} min, ${maxFps} max)\n` +
            `\n` +
            `thrust:               ${thrust}\n` +
            `thrust vector:        ${thrustVectorX} | ${thrustVectorY}\n` +
            `acceleration:         ${acceleration}\n` +
            `acceleration vector:  ${accelVectorX} | ${accelVectorY}\n` +
            `speed:                ${speed}\n` +
            `velocity vector:      ${velocityX} | ${velocityY}\n` +
            `position:             ${x} | ${y}\n` +
            `\n` +
            `angular acceleration: ${angularAccelerationDeg} deg/s^2\n` +
            `angular speed:        ${angularSpeedDeg} deg/s\n` +
            `rotation:             ${rotationDegStr} deg\n` +
            `\n` +
            `directions:           pos: ${positionArrow} | vel: ${velocityArrow} | acl: ${accelerationArrow} | rot: ${rotationArrow}`;
    }
}

function vectorAngleDegrees(x: number, y: number): number {
    return angleDegrees(Math.atan2(y, x) + Math.PI / 2);
}

function angleDegrees(radians: number): number {
    const deg = (radians * RAD_TO_DEG) % 360;
    if (deg < 0) {
        return 360 + deg;
    }
    return deg;
}

function angleToArrow(angleDeg: number): string {
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round((angleDeg) / 45) % 8;
    return directions[index];
}

