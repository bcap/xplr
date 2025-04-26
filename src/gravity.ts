import { PhysicalObject } from "./physobject";
import { Point } from "pixi.js";

export const G = 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2

export function gravityForce(obj1: PhysicalObject, obj2: PhysicalObject): [Point, Point] {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance_sq = dx * dx + dy * dy;
    const distance = Math.sqrt(distance_sq);
    const force = (G * obj1.mass * obj2.mass) / distance_sq;
    const forceX = (force * dx) / distance;
    const forceY = (force * dy) / distance;
    const acceleration1X = forceX / obj1.mass;
    const acceleration1Y = forceY / obj1.mass;
    const acceleration2X = -forceX / obj2.mass;
    const acceleration2Y = -forceY / obj2.mass;
    return [
        new Point(acceleration1X, acceleration1Y),
        new Point(acceleration2X, acceleration2Y),
    ];
}

export function applyGravityForce(obj1: PhysicalObject, obj2: PhysicalObject) {
    const [acceleration1, acceleration2] = gravityForce(obj1, obj2);
    obj1.acceleration.x += acceleration1.x;
    obj1.acceleration.y += acceleration1.y;
    obj2.acceleration.x += acceleration2.x;
    obj2.acceleration.y += acceleration2.y;
}