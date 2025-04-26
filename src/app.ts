import { Application, Ticker, DEG_TO_RAD } from "pixi.js";
import { SpaceShip } from './spaceship';
import Keyboard from "pixi.js-keyboard";
import { Telemetry } from "./telemetry";
import { AstroBody } from "./astrobody";
import { applyGravityForce } from "./gravity";
import { Viewport } from "./viewport";

export class App {
    app: Application;
    viewport: Viewport;
    spaceShip: SpaceShip;
    telemetry: Telemetry;
    bodies: AstroBody[];

    constructor() {
        this.app = new Application()
        this.spaceShip = new SpaceShip();
        this.telemetry = new Telemetry(this.spaceShip);
        this.viewport = new Viewport();
        this.bodies = [
            new AstroBody("Sirius A"),
            // new AstroBody("Sirius B"),
        ]
    }

    async init() {
        await this.app.init({
            background: '#202020',
            resizeTo: window,
            preference: "webgpu",
        });

        await this.setupAssets();

        this.app.ticker.add(this.gameLoop.bind(this));
    }

    register(element: Element) {
        element.appendChild(this.app.canvas)
    }

    async setupAssets() {
        this.bodies[0].color = 0xFFAA00;
        this.bodies[0].mass = 15000000000000000; // tons
        this.bodies[0].radius = 40;
        this.bodies[0].x = this.app.screen.width / 2;
        this.bodies[0].y = this.app.screen.height / 2;
        // this.bodies[0].velocity = new Point(20, 20);

        // this.bodies[1].color = 0xAAAAFF;
        // this.bodies[1].mass = 15000000000000000; // tons
        // this.bodies[1].radius = 30;
        // this.bodies[1].x = this.app.screen.width / 2 + 160;
        // this.bodies[1].y = this.app.screen.height / 2 + 200;
        // this.bodies[1].velocity = new Point(-50, 0);

        for (const body of this.bodies) {
            await body.draw();
            this.viewport.addChild(body);
        }

        this.spaceShip.draw();
        this.spaceShip.mass = 100 // 100 tons
        this.spaceShip.x = this.app.screen.width / 2 - 200;
        this.spaceShip.y = this.app.screen.height / 2 - 200;
        this.spaceShip.velocity.x = -20;
        this.spaceShip.velocity.y = 40;
        this.spaceShip.angle = 200;
        this.spaceShip.angularSpeed = -12.5 * DEG_TO_RAD;
        // this.spaceShip.velocity = new Point(-10 + Math.random() * 20, -10 + Math.random() * 20);
        // this.spaceShip.friction = new Point(0.01, 0.01);
        // this.spaceShip.angularSpeed = (-180 + Math.random() * 360) * DEG_TO_RAD;
        // this.spaceShip.angularFriction = 0.01;

        this.viewport.addChild(this.spaceShip);
        this.app.stage.addChild(this.viewport);

        this.telemetry.draw();
        this.telemetry.x = 10;
        this.telemetry.y = 10;
        this.app.stage.addChild(this.telemetry);
    }

    gameLoop(ticker: Ticker) {
        Keyboard.update();

        // for (let i = 0 ; i < this.bodies.length - 1; i++) {
        //     applyGravityForce(this.bodies[i], this.bodies[(i + 1)]);
        // }
        for (const body of this.bodies) {
            applyGravityForce(this.spaceShip, body);
        }

        this.viewport.update(ticker);
        this.spaceShip.update(ticker);
        for (const body of this.bodies) {
            body.update(ticker);
        }
        this.telemetry.update(ticker);

        // update viewport position
        this.viewport.x = this.app.screen.width / 2 - this.spaceShip.x;
        this.viewport.y = this.app.screen.height / 2 - this.spaceShip.y;

        // reset accelerations
        this.spaceShip.acceleration.x = 0;
        this.spaceShip.acceleration.y = 0;
        for (const body of this.bodies) {
            body.acceleration.x = 0;
            body.acceleration.y = 0;
        }
    }
}