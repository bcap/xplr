import { Container, Ticker, Point} from 'pixi.js';
import { cutoff } from './math';

// This is a cutoff value for floating point numbers.
// It is used to determine if a number is close enough to zero and thus should be set to zero
const cutoffV = 10e-5;

export class PhysicalObject extends Container {
    // Mass in tons
    mass: number = 0;

    // Velocity in pixels per second
    velocity: Point = new Point(0, 0);

    // Acceleration in pixels per second^2
    // TODO: use a vec2 type instead
    acceleration: Point = new Point(0, 0);

    // Friction in factor per second. Ranges from 0 to 1. The higher the value, the more friction is applied.
    // Examples:
    // - [0, 0]: no friction
    // - [1, 1]: instant stop
    // - [0.2, 0.2]: 20% of velocity is lost every second
    // - [0.2, 0]: 20% of x velocity is lost every second
    // - [0, 0.2]: 20% of y velocity is lost every second
    friction: Point = new Point(0, 0);

    // Angular speed in radians per second
    angularSpeed: number = 0;

    // Angular acceleration in radians per second^2
    angularAcceleration: number = 0;

    // Angular friction, in factor per second. Ranges from 0 to 1. The higher the value, the more friction is applied.
    // Examples:
    // - 0: no friction
    // - 1: instant stop
    // - 0.2: 20% of angular speed is lost every second
    angularFriction: number = 0;

    // Returns the current linear speed of the object, in pixels per second
    get speed(): number {
        return Math.sqrt(
            this.velocity.x * this.velocity.x +
            this.velocity.y * this.velocity.y
        )
    }

    zeroMomentum() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.angularSpeed = 0;
    }

    update(ticker: Ticker) {
        const secs = ticker.deltaMS / 1000;

        if (this.acceleration.x !== 0 || this.acceleration.y !== 0) {
            this.velocity.x += this.acceleration.x * secs;
            this.velocity.y += this.acceleration.y * secs;
            this.acceleration.x = cutoff(this.acceleration.x, cutoffV);
            this.acceleration.y = cutoff(this.acceleration.y, cutoffV);
        }

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.velocity.x *= Math.pow(1 - this.friction.x, secs);
            this.velocity.y *= Math.pow(1 - this.friction.y, secs);
            this.x += this.velocity.x * secs;
            this.y += this.velocity.y * secs;
            this.velocity.x = cutoff(this.velocity.x, cutoffV);
            this.velocity.y = cutoff(this.velocity.y, cutoffV);
        }

        if (this.angularAcceleration !== 0) {
            this.angularSpeed += this.angularAcceleration * secs;
            this.angularAcceleration = cutoff(this.angularAcceleration, cutoffV);
        }

        if (this.angularSpeed !== 0) {
            this.angularSpeed *= Math.pow(1 - this.angularFriction, secs);
            this.rotation += this.angularSpeed * secs;
            this.angularSpeed = cutoff(this.angularSpeed, cutoffV);
        }
    }
}

