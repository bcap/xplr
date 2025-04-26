import { Graphics, Ticker } from "pixi.js";
import { PhysicalObject } from "./physobject";

export class AstroBody extends PhysicalObject {
    name: string;
    radius: number = 10;
    color: number = 0xFFFFFF;

    private _body = new Graphics();

    constructor(name: string) {
        super();
        this.name = name;
    }

    async draw() {
        this._body.circle(0, 0, this.radius);
        this._body.fill(this.color);
        this.addChild(this._body);
    }

    update(ticker: Ticker) {
        super.update(ticker);
    }
}

